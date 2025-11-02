const admin = require('../config/firebase');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;

    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.dbUser = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const checkPremium = (req, res, next) => {
  if (!req.dbUser.isPremium) {
    return res.status(403).json({
      error: 'Premium subscription required',
      isPremium: false
    });
  }

  if (req.dbUser.premiumExpiresAt && new Date() > req.dbUser.premiumExpiresAt) {
    return res.status(403).json({
      error: 'Premium subscription expired',
      isPremium: false
    });
  }

  next();
};

module.exports = { authenticateUser, checkPremium };
