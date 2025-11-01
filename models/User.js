const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false
    },
    onboardingStep: {
      type: Number,
      default: 1
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    photoURL: {
      type: String,
      default: '',
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    premiumExpiresAt: {
      type: Date,
      default: null,
    },
    createdResumes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    }],
    createdPortfolios: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Portfolio',
    }],
  },
  {
    timestamps: true,
  }
);

/**
 * Finds a user by their Firebase UID or creates a new one if they don't exist.
 * This is useful for synchronizing Firebase Auth users with the local database.
 * @param {object} firebaseUser - The user object from Firebase Auth.
 * @returns {Promise<Document>} The found or created user document.
 */
userSchema.statics.findOrCreate = async function (firebaseUser) {
  try {
    const user = await this.findOne({ firebaseUid: firebaseUser.uid });

    if (user) {
      // User exists, you could update fields if they change in Firebase
      // For example: user.displayName = firebaseUser.displayName; await user.save();
      return user;
    } else {
      // User doesn't exist, create a new one
      return await this.create({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || 'New User',
        photoURL: firebaseUser.photoURL || '',
      });
    }
  } catch (error) {
    console.error('Error in findOrCreate user:', error);
    throw error;
  }
};

module.exports = mongoose.model('User', userSchema);
