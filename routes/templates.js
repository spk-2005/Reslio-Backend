const express = require('express');
const router = express.Router();
const { getAllTemplates, getTemplateById, createTemplate } = require('../controllers/templateController');
const { authenticateUser } = require('../middleware/auth');

router.get('/', getAllTemplates);
router.get('/:id', getTemplateById);
router.post('/', authenticateUser, createTemplate);

module.exports = router;
