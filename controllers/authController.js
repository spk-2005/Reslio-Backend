const admin = require('../config/firebaseAdmin');
const User = require('../models/User');
const Information = require('../models/Information');
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

    // Check if this is a new user by seeing if they exist before the upsert
    const existingUser = await User.findOne({ firebaseUid: uid });

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

    // 3. If it was a new user, create their initial Information profile
    if (!existingUser) {
      console.log('🌱 New user detected, creating initial information profile...');
      await Information.create({
        userId: user._id,
        personalDetails: {
          name: name || 'Your Name',
          email: email || '',
          phone: '+1 234 567 890',
          location: 'City, Country',
        },
        experience: [{
          position: 'Software Engineer',
          company: 'Tech Solutions Inc.',
          type: 'Job',
          startDate: 'Jan 2022',
          endDate: 'Present',
          description: 'Developed and maintained web applications using modern technologies.'
        }],
        education: [{
          institution: 'State University',
          degree: 'B.Sc in Computer Science',
        }],
      });
    }
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