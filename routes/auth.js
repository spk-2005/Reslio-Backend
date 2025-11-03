const express = require('express');
const router = express.Router();
const admin = require('../config/firebaseAdmin');
const User = require('../models/User');
const { adminLogin } = require('../controllers/authController');

// @desc    Sync user with DB after Firebase login/signup
// @route   POST /api/auth/sync-user
router.post('/sync-user', async (req, res) => {
  try {
    // Support both Authorization header and request body
    const authHeader = req.headers.authorization;
    let token = req.body.token;
    
    // Prefer Authorization header if present
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    if (!token) {
      return res.status(400).json({ 
        message: 'Firebase token is required' 
      });
    }

    console.log('🔐 Verifying Firebase token...');
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('✅ Token verified for user:', decodedToken.email);
    
    const { uid, email, name, picture } = decodedToken;

    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { 
        firebaseUid: uid, 
        email, 
        displayName: name, 
        photoURL: picture,
        lastLogin: new Date() 
      },
      { 
        upsert: true, 
        new: true, 
        setDefaultsOnInsert: true 
      }
    );
    
    console.log('✅ User synced successfully:', user._id);
    
    res.status(200).json({
      success: true,
      message: 'User synced successfully',
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }
    });
  } catch (error) {
    console.error('❌ Auth sync error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ 
        message: 'Token expired. Please sign in again.' 
      });
    }
    
    if (error.code === 'auth/argument-error') {
      return res.status(400).json({ 
        message: 'Invalid token format.' 
      });
    }
    
    res.status(401).json({ 
      message: 'Invalid token. Sync failed.', 
      error: error.message 
    });
  }
});

// @desc    Authenticate admin user & get token
// @route   POST /api/auth/admin-login
router.post('/admin-login', adminLogin);



module.exports = router;
