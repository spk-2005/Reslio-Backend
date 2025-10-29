const express = require('express');
const router = express.Router();
const { getInformation, saveInformation } = require('../controllers/informationController');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have an auth middleware

// All routes below require authentication
router.use(authMiddleware);

// Get user's information
router.get('/:userId', getInformation);
// Save/Update user's information
router.post('/', saveInformation); // Or router.put('/', saveInformation); if you prefer PUT for updates

module.exports = router;