const express = require('express');
const router = express.Router();
const { registerOrLogin, getProfile, updatePremiumStatus, adminLogin } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');

router.post('/login', registerOrLogin);
router.post('/admin-login', adminLogin); // Add this route for the admin panel
router.get('/profile', authenticateUser, getProfile);
router.put('/premium', authenticateUser, updatePremiumStatus);

module.exports = router;
