// @ts-nocheck
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const Information = require('../models/Information');
const User = require('../models/User');

// @desc    Get user profile data
// @route   GET /api/profile
// @access  Private
router.get('/', authenticateUser, async (req, res) => {
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

    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Server error while fetching profile.' });
  }
});

// @desc    Update user personal details
// @route   PUT /api/profile/details
// @access  Private
router.put('/details', authenticateUser, async (req, res) => {
  try {
    const { displayName, phoneNumber, location } = req.body;

    // 1. Update the main User model for the display name
    await User.findByIdAndUpdate(req.dbUser._id, { displayName });

    // 2. Update (or create) the Information model for other details
    const updatedInfo = await Information.findOneAndUpdate(
      { userId: req.dbUser._id },
      { $set: { 'personalDetails.name': displayName, 'personalDetails.phone': phoneNumber, 'personalDetails.location': location } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(updatedInfo);
  } catch (error) {
    res.status(500).json({ error: 'Server error while updating profile.' });
  }
});

module.exports = router;