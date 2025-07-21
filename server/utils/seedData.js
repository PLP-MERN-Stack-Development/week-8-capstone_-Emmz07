import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from '../models/Property.js';
import Tenant from '../models/Tenant.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Property.deleteMany({}),
      Tenant.deleteMany({}),
      Payment.deleteMany({}),
      User.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@rentroll.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Created admin user');

    // Create sample properties
    const properties = [
      {
        name: 'Sunset Apartments',
        type: 'apartment',
        address: '123 Main St, Springfield, IL 62701',
        units: 12,
        image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'Modern apartment complex with amenities',
        monthlyRent: 1200,
        status: 'active'
      },
      {
        name: 'Oak House',
        type: 'house',
        address: '456 Oak Ave, Springfield, IL 62702',
        units: 1,
        image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'Beautiful single family home',
        monthlyRent: 1800,
        status: 'active'
      },
      {
        name: 'Downtown Commercial Plaza',
        type: 'commercial',
        address: '789 Business Blvd, Springfield, IL 62703',
        units: 8,
        image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: 'Prime commercial space in downtown',
        monthlyRent: 2500,
        status: 'active'
      }
    ];

    const createdProperties = await Property.insertMany(properties);
    console.log('Created sample properties');

    // Create sample tenants
    const tenants = [
      {
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+15550123',
        propertyId: createdProperties[0]._id,
        unit: 'A1',
        rentAmount: 1200,
        leaseStart: new Date('2024-01-01'),
        leaseEnd: new Date('2024-12-31'),
        status: 'active',
        securityDeposit: 1200,
        emergencyContact: {
          name: 'Jane Doe',
          phone: '+1-555-0124',
          relationship: 'Spouse'
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+15550456',
        propertyId: createdProperties[0]._id,
        unit: 'B2',
        rentAmount: 1150,
        leaseStart: new Date('2024-02-01'),
        leaseEnd: new Date('2025-01-31'),
        status: 'active',
        securityDeposit: 1150
      },
      {
        name: 'Bob Johnson',
        email: 'bob.johnson@email.com',
        phone: '+15550789',
        propertyId: createdProperties[1]._id,
        unit: 'Main',
        rentAmount: 1800,
        leaseStart: new Date('2024-03-01'),
        leaseEnd: new Date('2025-02-28'),
        status: 'active',
        securityDeposit: 1800
      },
      {
        name: 'Tech Startup LLC',
        email: 'contact@techstartup.com',
        phone: '+15550321',
        propertyId: createdProperties[2]._id,
        unit: 'Suite 101',
        rentAmount: 2500,
        leaseStart: new Date('2024-01-15'),
        leaseEnd: new Date('2026-01-14'),
        status: 'active',
        securityDeposit: 5000
      }
    ];

    const createdTenants = await Tenant.insertMany(tenants);
    console.log('Created sample tenants');

    // Create sample payments
    const payments = [];
    const currentDate = new Date();
    
    // Generate payments for the last 3 months and next month
    for (let monthOffset = -3; monthOffset <= 1; monthOffset++) {
      const paymentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1);
      
      createdTenants.forEach((tenant, index) => {
        const payment = {
          tenantId: tenant._id,
          amount: tenant.rentAmount,
          dueDate: new Date(paymentDate),
          status: 'pending',
          paymentMethod: 'bank_transfer'
        };

        // Mark some payments as paid (past months)
        if (monthOffset < 0) {
          payment.paidDate = new Date(paymentDate.getTime() + (Math.random() * 10 + 1) * 24 * 60 * 60 * 1000);
          payment.status = 'paid';
        } else if (monthOffset === 0) {
          // Current month - some paid, some overdue
          if (index % 3 === 0) {
            payment.status = 'overdue';
          } else if (index % 2 === 0) {
            payment.paidDate = new Date();
            payment.status = 'paid';
          }
        }

        payments.push(payment);
      });
    }

    await Payment.insertMany(payments);
    console.log('Created sample payments');

    console.log('✅ Seed data created successfully!');
    console.log('Admin login: admin@rentroll.com / admin123');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run seed if called directly
seedData();


export default seedData;