const User = require('../models/User');
const { auth } = require('../config/firebase');

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
