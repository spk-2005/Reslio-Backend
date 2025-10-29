const mongoose = require('mongoose');

const personalDetailsSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    // Add more personal details fields as needed (e.g., profile picture URL)
});

const experienceSchema = new mongoose.Schema({
    position: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Job', 'Internship', 'Freelance', 'Webinar', 'Volunteering', 'Other'], default: 'Job' },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true }, // Could be 'Present'
    description: { type: String, trim: true },
    salary: { type: String, trim: true }, // Optional, only for jobs
});

const educationSchema = new mongoose.Schema({
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true }, // e.g., "B.Tech in Computer Science"
    field: { type: String, trim: true }, // e.g., "Computer Science"
    endDate: { type: String, trim: true }, // Graduation date
});

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    liveLink: { type: String, trim: true },
    githubLink: { type: String, trim: true },
});

const achievementSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Award', 'Certification', 'Publication', 'Patent', 'Honor', 'Other'], default: 'Certification' },
    issuer: { type: String, trim: true },
    date: { type: String, trim: true },
});

const contactLinkSchema = new mongoose.Schema({
    type: { type: String, enum: ['LinkedIn', 'GitHub', 'Portfolio', 'Website', 'Twitter', 'Blog', 'Other'], default: 'Website' },
    url: { type: String, required: true, trim: true },
});

const informationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true,
        unique: true, // Each user should have only one information document
    },
    personalDetails: {
        type: personalDetailsSchema,
        default: () => ({}), // Initialize as an empty object if not provided
    },
    experience: {
        type: [experienceSchema],
        default: [],
    },
    education: {
        type: [educationSchema],
        default: [],
    },
    projects: {
        type: [projectSchema],
        default: [],
    },
    achievements: {
        type: [achievementSchema],
        default: [],
    },
    contactLinks: {
        type: [contactLinkSchema],
        default: [],
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

const Information = mongoose.model('Information', informationSchema);

module.exports = Information;