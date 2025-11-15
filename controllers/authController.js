const admin = require('../config/firebaseAdmin');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.syncUser = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Firebase token is required' });
  }

  try {
    // 1. Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    // 2. Find user in DB or create a new one (upsert)
    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        firebaseUid: uid,
        email,
        displayName: name,
        photoURL: picture,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // 3. Generate our own backend JWT
    const backendToken = generateToken(user._id);

    res.status(200).json({
      message: 'User synced successfully',
      token: backendToken,
      user,
    });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(401).json({ message: 'Invalid Firebase token or sync failed' });
  }
};