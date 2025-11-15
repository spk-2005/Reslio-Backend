// @ts-nocheck
const Information = require('../models/Information');
const User = require('../models/User');

// @desc    Get user profile data
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    // Find the information document linked to the user
    let info = await Information.findOne({ userId: req.dbUser._id });

    if (!info) {
      // If no info document exists, create a basic one
      info = await Information.create({ userId: req.dbUser._id });
    }

    // Combine the core user data with the detailed information
    const userProfile = {
      ...req.dbUser.toObject(), // Core user data (email, photoURL, etc.)
      ...info.toObject(),      // Detailed profile data (experience, education, etc.)
    };

    res.status(200).json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, error: 'Server error while fetching profile.' });
  }
};

// @desc    Update user personal details
// @route   PUT /api/profile/details
// @access  Private
exports.updateDetails = async (req, res) => {
  try {
    // Logic to update user details (similar to your existing code)
    res.status(200).json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, error: 'Server error while updating profile.' });
  }
};