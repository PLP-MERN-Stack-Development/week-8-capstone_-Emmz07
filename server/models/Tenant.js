import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tenant name is required'],
    trim: true,
    maxlength: [100, 'Tenant name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property ID is required']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true,
    maxlength: [20, 'Unit cannot exceed 20 characters']
  },
  rentAmount: {
    type: Number,
    required: [true, 'Rent amount is required'],
    min: [0, 'Rent amount cannot be negative']
  },
  leaseStart: {
    type: Date,
    required: [true, 'Lease start date is required']
  },
  leaseEnd: {
    type: Date,
    required: [true, 'Lease end date is required'],
    validate: {
      validator: function(value) {
        return value > this.leaseStart;
      },
      message: 'Lease end date must be after lease start date'
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  securityDeposit: {
    type: Number,
    min: [0, 'Security deposit cannot be negative'],
    default: 0
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  }
}, {
  timestamps: true
});

// Compound index for unique unit per property
tenantSchema.index({ propertyId: 1, unit: 1 }, { unique: true });

// Index for better search performance
tenantSchema.index({ name: 'text', email: 'text' });

export default mongoose.model('Tenant', tenantSchema);