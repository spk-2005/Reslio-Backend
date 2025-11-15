const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Verify the backend-issued JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user by the ID stored in the token's payload
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Not authorized, user not found' });
    }
    
    // Attach the full user object from DB to the request
    req.user = user; // For consistency with other controllers
    req.dbUser = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

const checkPremium = (req, res, next) => {
  if (!req.dbUser || !req.dbUser.isPremium) {
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
