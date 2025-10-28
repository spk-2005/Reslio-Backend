require('dotenv').config();
const mongoose = require('mongoose');
const Template = require('../models/Template');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const resumeTemplates = [
  {
    name: 'Professional',
    type: 'resume',
    description: 'Clean and modern professional resume template',
    thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&w=400',
    isPremium: false,
    structure: {
      sections: ['personalInfo', 'summary', 'experience', 'education', 'skills'],
      layout: 'single-column',
      colors: {
        primary: '#2c3e50',
        secondary: '#3498db',
        text: '#333333',
      },
    },
  },
  {
    name: 'Creative',
    type: 'resume',
    description: 'Stand out with creative design elements',
    thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&w=400',
    isPremium: false,
    structure: {
      sections: ['personalInfo', 'summary', 'experience', 'skills', 'projects', 'education'],
      layout: 'two-column',
      colors: {
        primary: '#9b59b6',
        secondary: '#e74c3c',
        text: '#2c3e50',
      },
    },
  },
  {
    name: 'Executive',
    type: 'resume',
    description: 'Perfect for senior leadership positions',
    thumbnail: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&w=400',
    isPremium: true,
    structure: {
      sections: ['personalInfo', 'summary', 'experience', 'education', 'skills', 'certifications'],
      layout: 'single-column',
      colors: {
        primary: '#1a1a1a',
        secondary: '#c0392b',
        text: '#333333',
      },
    },
  },
  {
    name: 'Minimalist',
    type: 'resume',
    description: 'Simple and elegant design',
    thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&w=400',
    isPremium: false,
    structure: {
      sections: ['personalInfo', 'experience', 'education', 'skills'],
      layout: 'single-column',
      colors: {
        primary: '#34495e',
        secondary: '#95a5a6',
        text: '#2c3e50',
      },
    },
  },
  {
    name: 'Modern Tech',
    type: 'resume',
    description: 'Designed for tech professionals',
    thumbnail: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&w=400',
    isPremium: false,
    structure: {
      sections: ['personalInfo', 'summary', 'skills', 'experience', 'projects', 'education'],
      layout: 'two-column',
      colors: {
        primary: '#16a085',
        secondary: '#2980b9',
        text: '#2c3e50',
      },
    },
  },
];

const portfolioTemplates = [
  {
    name: 'Modern Portfolio',
    type: 'portfolio',
    description: 'Contemporary design with smooth animations',
    thumbnail: 'https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&w=400',
    isPremium: false,
    structure: {
      sections: ['hero', 'about', 'projects', 'skills', 'contact'],
      layout: 'single-page',
      colors: {
        primary: '#667eea',
        secondary: '#764ba2',
        text: '#333333',
        background: '#ffffff',
      },
    },
  },
  {
    name: 'Developer Portfolio',
    type: 'portfolio',
    description: 'Perfect for showcasing your code projects',
    thumbnail: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&w=400',
    isPremium: false,
    structure: {
      sections: ['hero', 'about', 'projects', 'experience', 'skills', 'contact'],
      layout: 'multi-page',
      colors: {
        primary: '#0d1117',
        secondary: '#58a6ff',
        text: '#c9d1d9',
        background: '#0d1117',
      },
    },
  },
  {
    name: 'Designer Portfolio',
    type: 'portfolio',
    description: 'Visual-first design for creatives',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&w=400',
    isPremium: true,
    structure: {
      sections: ['hero', 'projects', 'about', 'testimonials', 'contact'],
      layout: 'grid-based',
      colors: {
        primary: '#ff6b6b',
        secondary: '#4ecdc4',
        text: '#2c3e50',
        background: '#f8f9fa',
      },
    },
  },
  {
    name: 'Photography Portfolio',
    type: 'portfolio',
    description: 'Gallery-focused layout for photographers',
    thumbnail: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&w=400',
    isPremium: false,
    structure: {
      sections: ['hero', 'gallery', 'about', 'contact'],
      layout: 'masonry',
      colors: {
        primary: '#1a1a1a',
        secondary: '#ffffff',
        text: '#333333',
        background: '#ffffff',
      },
    },
  },
  {
    name: 'Business Portfolio',
    type: 'portfolio',
    description: 'Professional business-focused design',
    thumbnail: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&w=400',
    isPremium: true,
    structure: {
      sections: ['hero', 'services', 'projects', 'testimonials', 'about', 'contact'],
      layout: 'multi-page',
      colors: {
        primary: '#2c3e50',
        secondary: '#3498db',
        text: '#333333',
        background: '#ecf0f1',
      },
    },
  },
];

const seedTemplates = async () => {
  try {
    await connectDB();

    await Template.deleteMany({});
    console.log('Existing templates removed');

    await Template.insertMany([...resumeTemplates, ...portfolioTemplates]);
    console.log('Templates seeded successfully');

    const count = await Template.countDocuments();
    console.log(`Total templates in database: ${count}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding templates:', error);
    process.exit(1);
  }
};

seedTemplates();
