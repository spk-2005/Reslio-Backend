const express = require('express');
const router = express.Router();
const { getInformation, saveInformation } = require('../controllers/informationController');
const { authenticateUser } = require('../middleware/auth');

// All routes below require authentication
router.use(authenticateUser);

// Get user's information
router.get('/:userId', getInformation);
// Save/Update user's information
router.post('/', saveInformation); // Or router.put('/', saveInformation); if you prefer PUT for updates

module.exports = router;