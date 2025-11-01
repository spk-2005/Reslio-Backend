const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Information = require('../models/Information');

// @desc    Get user information
// @route   GET /api/information
// @access  Private
router.get('/', protect, async (req, res) => {
  const info = await Information.findOne({ userId: req.user._id });
  if (info) {
    res.json(info);
  } else {
    res.status(404).json({ message: 'Information not found for this user.' });
  }
});

// @desc    Create or update user information
// @route   PUT /api/information
// @access  Private
router.put('/', protect, async (req, res) => {
  const info = await Information.findOneAndUpdate(
    { userId: req.user._id },
    { ...req.body, userId: req.user._id },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.status(200).json(info);
});

module.exports = router;