const admin = require('../config/firebase');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      // Find the user in MongoDB using the firebaseUid and attach it to the request
      req.user = await User.findOne({ firebaseUid: decodedToken.uid }).select('-__v');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found in DB' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };