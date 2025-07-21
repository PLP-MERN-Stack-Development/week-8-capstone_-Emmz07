import express from 'express';
import { body, validationResult } from 'express-validator';
import Payment from '../models/Payment.js';
import Tenant from '../models/Tenant.js';

const router = express.Router();

// Validation middleware
const paymentValidation = [
  body('tenantId').isMongoId().withMessage('Valid tenant ID is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Payment amount must be a positive number'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('paidDate').optional().isISO8601().withMessage('Valid paid date is required'),
  body('status').isIn(['pending', 'paid', 'partial', 'overdue']).withMessage('Invalid payment status'),
  body('paymentMethod').optional().isIn(['cash', 'check', 'bank_transfer', 'credit_card', 'online']).withMessage('Invalid payment method')
];

// GET /api/payments - Get all payments
router.get('/', async (req, res) => {
  try {
    const { search, status, tenantId, startDate, endDate } = req.query;
    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by tenant
    if (tenantId) {
      query.tenantId = tenantId;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.dueDate = {};
      if (startDate) query.dueDate.$gte = new Date(startDate);
      if (endDate) query.dueDate.$lte = new Date(endDate);
    }

    let payments = await Payment.find(query)
      .populate({
        path: 'tenantId',
        select: 'name email unit',
        populate: {
          path: 'propertyId',
          select: 'name address'
        }
      })
      .sort({ dueDate: -1 });

    // Search functionality (after population)
    if (search) {
      payments = payments.filter(payment => 
        payment.tenantId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        payment.tenantId?.propertyId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        payment.tenantId?.unit?.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
});

// GET /api/payments/:id - Get single payment
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate({
        path: 'tenantId',
        select: 'name email unit',
        populate: {
          path: 'propertyId',
          select: 'name address'
        }
      });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment', error: error.message });
  }
});

// POST /api/payments - Create new payment
router.post('/', paymentValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation errors', errors: errors.array() });
    }

    // Check if tenant exists
    const tenant = await Tenant.findById(req.body.tenantId);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    // Auto-update status based on dates
    const payment = new Payment(req.body);
    
    if (payment.paidDate) {
      payment.status = 'paid';
    } else if (new Date(payment.dueDate) < new Date()) {
      payment.status = 'overdue';
    }

    await payment.save();
    
    const populatedPayment = await Payment.findById(payment._id)
      .populate({
        path: 'tenantId',
        select: 'name email unit',
        populate: {
          path: 'propertyId',
          select: 'name address'
        }
      });

    res.status(201).json(populatedPayment);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Error creating payment', error: error.message });
  }
});

// PUT /api/payments/:id - Update payment
router.put('/:id', paymentValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation errors', errors: errors.array() });
    }

    // Auto-update status based on dates
    if (req.body.paidDate && req.body.status !== 'paid') {
      req.body.status = 'paid';
    } else if (!req.body.paidDate && new Date(req.body.dueDate) < new Date()) {
      req.body.status = 'overdue';
    }

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate({
      path: 'tenantId',
      select: 'name email unit',
      populate: {
        path: 'propertyId',
        select: 'name address'
      }
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Error updating payment', error: error.message });
  }
});

// DELETE /api/payments/:id - Delete payment
router.delete('/:id', async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payment', error: error.message });
  }
});

// POST /api/payments/bulk - Create bulk payments (for monthly rent generation)
router.post('/bulk', async (req, res) => {
  try {
    const { month, year } = req.body;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    // Get all active tenants
    const tenants = await Tenant.find({ status: 'active' });
    
    const payments = [];
    const dueDate = new Date(year, month - 1, 1); // First day of the month

    for (const tenant of tenants) {
      // Check if payment already exists for this month
      const existingPayment = await Payment.findOne({
        tenantId: tenant._id,
        dueDate: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1)
        }
      });

      if (!existingPayment) {
        const payment = new Payment({
          tenantId: tenant._id,
          amount: tenant.rentAmount,
          dueDate: dueDate,
          status: 'pending'
        });

        payments.push(payment);
      }
    }

    if (payments.length > 0) {
      await Payment.insertMany(payments);
    }

    res.json({ 
      message: `Created ${payments.length} payment records for ${month}/${year}`,
      count: payments.length 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating bulk payments', error: error.message });
  }
});

export default router;