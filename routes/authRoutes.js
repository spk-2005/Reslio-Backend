const express = require('express');
const router = express.Router();
const admin = require('../config/firebaseAdmin');
const User = require('../models/User');

// @desc    Sync user with DB after Firebase login
// @route   POST /api/auth/sync
// @access  Public (token is verified here)
router.post('/sync', async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Firebase token is required' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { firebaseUid: uid, email, displayName: name, photoURL: picture },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token. Sync failed.', error: error.message });
  }
});



module.exports = router;