const express = require('express');
const router = express.Router();
const {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} = require('../controllers/templateController');

// @desc    Get all templates, optionally filtered by type
// @route   GET /api/templates
// @access  Public
router.get('/', getAllTemplates);

// @desc    Get a single template by its ID
// @route   GET /api/templates/:id
// @access  Public
router.get('/:id', getTemplateById);

// @desc    Create a new template
// @route   POST /api/templates
// @access  Public (no auth for now)
router.post('/', createTemplate);

// @desc    Update a template
// @route   PUT /api/templates/:id
// @access  Public (no auth for now)
router.put('/:id', updateTemplate);

// @desc    Delete a template
// @route   DELETE /api/templates/:id
// @access  Public (no auth for now)
router.delete('/:id', deleteTemplate);

module.exports = router;