import express from 'express';
import { body, validationResult } from 'express-validator';
import Tenant from '../models/Tenant.js';
import Property from '../models/Property.js';
import Payment from '../models/Payment.js';

const router = express.Router();

// Validation middleware
const tenantValidation = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Tenant name is required and must be less than 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Valid phone number is required'),
  body('propertyId').isMongoId().withMessage('Valid property ID is required'),
  body('unit').trim().isLength({ min: 1, max: 20 }).withMessage('Unit is required and must be less than 20 characters'),
  body('rentAmount').isFloat({ min: 0 }).withMessage('Rent amount must be a positive number'),
  body('leaseStart').isISO8601().withMessage('Valid lease start date is required'),
  body('leaseEnd').isISO8601().withMessage('Valid lease end date is required')
];

// GET /api/tenants - Get all tenants
router.get('/', async (req, res) => {
  try {
    const { search, status, propertyId } = req.query;
    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { unit: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by property
    if (propertyId) {
      query.propertyId = propertyId;
    }

    const tenants = await Tenant.find(query)
      .populate('propertyId', 'name address')
      .sort({ createdAt: -1 });

    res.json(tenants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tenants', error: error.message });
  }
});

// GET /api/tenants/:id - Get single tenant
router.get('/:id', async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id).populate('propertyId', 'name address');
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tenant', error: error.message });
  }
});

// POST /api/tenants - Create new tenant
router.post('/', tenantValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation errors', errors: errors.array() });
    }

    // Check if property exists
    const property = await Property.findById(req.body.propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if unit is already occupied
    const existingTenant = await Tenant.findOne({
      propertyId: req.body.propertyId,
      unit: req.body.unit,
      status: 'active'
    });

    if (existingTenant) {
      return res.status(400).json({ message: 'Unit is already occupied by an active tenant' });
    }

    // Validate lease dates
    if (new Date(req.body.leaseEnd) <= new Date(req.body.leaseStart)) {
      return res.status(400).json({ message: 'Lease end date must be after lease start date' });
    }

    const tenant = new Tenant(req.body);
    await tenant.save();
    
    const populatedTenant = await Tenant.findById(tenant._id).populate('propertyId', 'name address');
    res.status(201).json(populatedTenant);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists or unit is already occupied' });
    }
    res.status(500).json({ message: 'Error creating tenant', error: error.message });
  }
});

// PUT /api/tenants/:id - Update tenant
router.put('/:id', tenantValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation errors', errors: errors.array() });
    }

    // Check if property exists
    const property = await Property.findById(req.body.propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if unit is already occupied (excluding current tenant)
    const existingTenant = await Tenant.findOne({
      _id: { $ne: req.params.id },
      propertyId: req.body.propertyId,
      unit: req.body.unit,
      status: 'active'
    });

    if (existingTenant) {
      return res.status(400).json({ message: 'Unit is already occupied by another active tenant' });
    }

    const tenant = await Tenant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('propertyId', 'name address');

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    res.json(tenant);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists or unit is already occupied' });
    }
    res.status(500).json({ message: 'Error updating tenant', error: error.message });
  }
});

// DELETE /api/tenants/:id - Delete tenant
router.delete('/:id', async (req, res) => {
  try {
    // Delete all payments for this tenant
    await Payment.deleteMany({ tenantId: req.params.id });

    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    res.json({ message: 'Tenant and associated payments deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting tenant', error: error.message });
  }
});

export default router;