const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      required: true,
    },
    title: {
      type: String,
      default: 'My Portfolio',
    },
    data: {
      personalInfo: {
        fullName: String,
        tagline: String,
        email: String,
        phone: String,
        location: String,
        website: String,
        linkedin: String,
        github: String,
        twitter: String,
        instagram: String,
      },
      about: String,
      projects: [{
        title: String,
        description: String,
        images: [String],
        technologies: [String],
        liveUrl: String,
        githubUrl: String,
        featured: Boolean,
      }],
      skills: [{
        category: String,
        items: [String],
      }],
      experience: [{
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        description: String,
        current: Boolean,
      }],
      testimonials: [{
        name: String,
        role: String,
        company: String,
        text: String,
        avatar: String,
      }],
      contact: {
        email: String,
        phone: String,
        availability: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
