const express = require('express');
const router = express.Router();
const { getInformation, saveInformation } = require('../controllers/informationController');
const { authenticateUser } = require('../middleware/auth');

// All routes below require authentication
router.use(authenticateUser);

// Get user's information
router.get('/', getInformation);
// Save/Update user's information
router.put('/', saveInformation);

module.exports = router;