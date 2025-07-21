import express from 'express';
import Property from '../models/Property.js';
import Tenant from '../models/Tenant.js';
import Payment from '../models/Payment.js';

const router = express.Router();

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get current date for calculations
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Parallel queries for better performance
    const [
      totalProperties,
      totalTenants,
      activeTenants,
      monthlyPayments,
      overduePayments,
      totalRevenue,
      recentProperties,
      recentTenants
    ] = await Promise.all([
      // Total properties
      Property.countDocuments({ status: 'active' }),
      
      // Total tenants
      Tenant.countDocuments(),
      
      // Active tenants
      Tenant.countDocuments({ status: 'active' }),
      
      // Monthly payments
      Payment.find({
        dueDate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
      }).populate('tenantId', 'name rentAmount'),
      
      // Overdue payments
      Payment.find({
        status: 'overdue',
        dueDate: { $lt: now }
      }).populate({
        path: 'tenantId',
        select: 'name unit',
        populate: {
          path: 'propertyId',
          select: 'name'
        }
      }),
      
      // Total revenue (paid payments this year)
      Payment.aggregate([
        {
          $match: {
            status: 'paid',
            paidDate: {
              $gte: new Date(currentYear, 0, 1),
              $lte: new Date(currentYear, 11, 31)
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]),
      
      // Recent properties (last 5)
      Property.find({ status: 'active' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name address units image'),
      
      // Recent tenants (last 5)
      Tenant.find({ status: 'active' })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('propertyId', 'name')
        .select('name unit propertyId')
    ]);

    // Calculate monthly income (expected)
    const monthlyIncome = activeTenants > 0 ? 
      await Tenant.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: null, total: { $sum: '$rentAmount' } } }
      ]) : [{ total: 0 }];

    // Calculate payment statistics
    const paidPayments = monthlyPayments.filter(p => p.status === 'paid');
    const pendingPayments = monthlyPayments.filter(p => p.status === 'pending');
    
    const monthlyCollected = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const monthlyPending = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const overdueAmount = overduePayments.reduce((sum, payment) => sum + payment.amount, 0);

    // Occupancy rate
    const totalUnits = await Property.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$units' } } }
    ]);
    
    const occupancyRate = totalUnits.length > 0 && totalUnits[0].total > 0 ? 
      (activeTenants / totalUnits[0].total * 100).toFixed(1) : 0;

    res.json({
      overview: {
        totalProperties,
        totalTenants,
        activeTenants,
        monthlyIncome: monthlyIncome[0]?.total || 0,
        monthlyCollected,
        monthlyPending,
        overdueAmount,
        totalRevenue: totalRevenue[0]?.total || 0,
        occupancyRate: parseFloat(occupancyRate)
      },
      payments: {
        total: monthlyPayments.length,
        paid: paidPayments.length,
        pending: pendingPayments.length,
        overdue: overduePayments.length
      },
      recent: {
        properties: recentProperties,
        tenants: recentTenants,
        overduePayments: overduePayments.slice(0, 5) // Limit to 5 most recent
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
});

// GET /api/dashboard/revenue - Get revenue analytics
router.get('/revenue', async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    // Monthly revenue for the year
    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'paid',
          paidDate: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$paidDate' },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Fill missing months with 0
    const months = Array.from({ length: 12 }, (_, i) => {
      const monthData = monthlyRevenue.find(m => m._id === i + 1);
      return {
        month: i + 1,
        revenue: monthData?.revenue || 0,
        count: monthData?.count || 0
      };
    });

    res.json({
      year: parseInt(year),
      months,
      total: months.reduce((sum, month) => sum + month.revenue, 0)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching revenue analytics', error: error.message });
  }
});

export default router;