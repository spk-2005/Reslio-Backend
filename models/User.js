const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
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

module.exports = mongoose.model('User', userSchema);
