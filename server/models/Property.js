import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Property name is required'],
    trim: true,
    maxlength: [100, 'Property name cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['apartment', 'house', 'commercial'],
    lowercase: true
  },
  address: {
    type: String,
    required: [true, 'Property address is required'],
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  units: {
    type: Number,
    required: [true, 'Number of units is required'],
    min: [1, 'Property must have at least 1 unit'],
    max: [1000, 'Property cannot have more than 1000 units']
  },
  image: {
    type: String,
    default: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=500'
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  monthlyRent: {
    type: Number,
    min: [0, 'Monthly rent cannot be negative']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for better search performance
propertySchema.index({ name: 'text', address: 'text' });

export default mongoose.model('Property', propertySchema);