const express = require('express');
const router = express.Router();
const { syncUser } = require('../controllers/authController');

// @desc    Sync Firebase user with backend and get a JWT
// @route   POST /api/auth/sync
// @access  Public
router.post('/sync', syncUser);

module.exports = router;