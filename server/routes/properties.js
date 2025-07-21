import express from 'express';
import { body, validationResult } from 'express-validator';
import Property from '../models/Property.js';
import Tenant from '../models/Tenant.js';

const router = express.Router();

// Validation middleware
const propertyValidation = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Property name is required and must be less than 100 characters'),
  body('type').isIn(['apartment', 'house', 'commercial']).withMessage('Property type must be apartment, house, or commercial'),
  body('address').trim().isLength({ min: 1, max: 200 }).withMessage('Address is required and must be less than 200 characters'),
  body('units').isInt({ min: 1, max: 1000 }).withMessage('Units must be between 1 and 1000'),
  body('image').optional().isURL().withMessage('Image must be a valid URL')
];

// GET /api/properties - Get all properties
router.get('/', async (req, res) => {
  try {
    const { search, type, status } = req.query;
    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
});

// GET /api/properties/:id - Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching property', error: error.message });
  }
});

// POST /api/properties - Create new property
router.post('/', propertyValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation errors', errors: errors.array() });
    }

    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Error creating property', error: error.message });
  }
});

// PUT /api/properties/:id - Update property
router.put('/:id', propertyValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation errors', errors: errors.array() });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Error updating property', error: error.message });
  }
});

// DELETE /api/properties/:id - Delete property
router.delete('/:id', async (req, res) => {
  try {
    // Check if property has tenants
    const tenantCount = await Tenant.countDocuments({ propertyId: req.params.id });
    if (tenantCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete property with active tenants. Please remove all tenants first.' 
      });
    }

    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property', error: error.message });
  }
});

export default router;