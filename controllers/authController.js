const User = require('../models/User');
const { auth } = require('../config/firebaseAdmin');
const jwt = require('jsonwebtoken');

exports.registerOrLogin = async (req, res) => {
  try {
    const { idToken, userData } = req.body;

    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email: email || userData.email,
        displayName: userData.displayName || 'User',
        photoURL: userData.photoURL || '',
      });
    } else {
      user.displayName = userData.displayName || user.displayName;
      user.photoURL = userData.photoURL || user.photoURL;
      await user.save();
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isPremium: user.isPremium,
        premiumExpiresAt: user.premiumExpiresAt,
      },
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
    });
  }
};

/**
 * @desc    Authenticate admin user & get token
 * @route   POST /api/auth/admin-login
 * @access  Public
 */
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  // For now, we use hardcoded credentials as requested.
  // In a real application, you would look up an admin user in the database.
  if (email === 'spk@111' && password === '123') {
    // Credentials are correct, generate a JWT
    const payload = {
      id: 'admin_user', // A static ID for the admin
      role: 'admin',
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d', // Token expires in 1 day
    });

    res.json({
      message: 'Admin login successful',
      token,
    });
  } else {
    // Credentials are incorrect
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.dbUser._id)
      .populate('createdResumes')
      .populate('createdPortfolios');

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
    });
  }
};

exports.updatePremiumStatus = async (req, res) => {
  try {
    const { isPremium, expiresAt } = req.body;

    const user = await User.findById(req.dbUser._id);
    user.isPremium = isPremium;
    user.premiumExpiresAt = expiresAt ? new Date(expiresAt) : null;
    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Premium update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update premium status',
    });
  }
};
