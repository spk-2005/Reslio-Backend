const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
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
      default: 'Untitled Resume',
    },
    data: {
      personalInfo: {
        fullName: String,
        email: String,
        phone: String,
        location: String,
        website: String,
        linkedin: String,
        github: String,
      },
      summary: String,
      experience: [{
        company: String,
        position: String,
        location: String,
        startDate: String,
        endDate: String,
        description: String,
        current: Boolean,
      }],
      education: [{
        institution: String,
        degree: String,
        field: String,
        location: String,
        startDate: String,
        endDate: String,
        gpa: String,
      }],
      skills: [{
        category: String,
        items: [String],
      }],
      projects: [{
        name: String,
        description: String,
        technologies: [String],
        link: String,
      }],
      certifications: [{
        name: String,
        issuer: String,
        date: String,
        credentialId: String,
      }],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resume', resumeSchema);
