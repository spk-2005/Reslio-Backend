const User = require('../models/User');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
// In your userController.js
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
    });
  }
};