const express = require('express');
const router = express.Router();
const Template = require('../models/Template'); // Assuming you have a Template model
const { authenticateAdmin } = require('../middleware/adminAuth'); // Import the correct admin middleware

// Public routes to allow the mobile app to see templates

// @desc    Get all templates, optionally filtered by type
// @route   GET /api/templates
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type } = req.query; // e.g., 'resume' or 'portfolio'
    const filter = type ? { type } : {};
    const templates = await Template.find(filter);
    res.json({ templates });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching templates' });
  }
});

// @desc    Get a single template by its ID
// @route   GET /api/templates/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching template' });
  }
});

// Admin-only route to create templates
router.post('/', authenticateAdmin, async (req, res) => {
  // Placeholder for admin creating a template
  res.status(501).json({ message: 'Not Implemented' });
});

module.exports = router;
