const express = require('express');
const router = express.Router();
const {
  getAllTemplates,
  getTemplateById,
  createTemplate,
} = require('../controllers/templateController');
const { authenticateUser } = require('../middleware/auth');

// Public routes to allow the mobile app to see templates

// @desc    Get all templates, optionally filtered by type
// @route   GET /api/templates
// @access  Public
router.get('/',  getAllTemplates);

// @desc    Get a single template by its ID
// @route   GET /api/templates/:id
// @access  Public
router.get('/:id', getTemplateById);

// Admin-only route to create templates
router.post('/', createTemplate);

module.exports = router;
