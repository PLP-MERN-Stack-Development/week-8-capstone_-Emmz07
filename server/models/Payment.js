import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: [true, 'Tenant ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Payment amount cannot be negative']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  paidDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'partial', 'overdue'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'check', 'bank_transfer', 'credit_card', 'online'],
    default: 'cash'
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot exceed 200 characters']
  },
  lateFee: {
    type: Number,
    min: [0, 'Late fee cannot be negative'],
    default: 0
  },
  receiptNumber: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Auto-generate receipt number for paid payments
paymentSchema.pre('save', function(next) {
  if (this.status === 'paid' && !this.receiptNumber) {
    this.receiptNumber = `RR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Index for better query performance
paymentSchema.index({ tenantId: 1, dueDate: -1 });
paymentSchema.index({ status: 1, dueDate: 1 });

export default mongoose.model('Payment', paymentSchema);