const express = require('express');
const router = express.Router();
const { registerOrLogin, getProfile, updatePremiumStatus } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');

router.post('/login', registerOrLogin);
router.get('/profile', authenticateUser, getProfile);
router.put('/premium', authenticateUser, updatePremiumStatus);

module.exports = router;
