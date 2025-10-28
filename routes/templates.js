const express = require('express');
const router = express.Router();
const { getAllTemplates, getTemplateById, createTemplate } = require('../controllers/templateController');
const { authenticateAdmin } = require('../middleware/adminAuth'); // Import the correct admin middleware

// Public routes to allow the mobile app to see templates
router.get('/', getAllTemplates);
router.get('/:id', getTemplateById);

// Admin-only route to create templates
router.post('/', authenticateAdmin, createTemplate);

module.exports = router;

