const mongoose = require('mongoose');

const personalDetailsSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    location: { type: String, trim: true },
    profilePicture: { type: String, trim: true }, // URL to profile picture
    dateOfBirth: { type: String, trim: true },
    nationality: { type: String, trim: true },
    headline: { type: String, trim: true }, // Professional headline/title
    summary: { type: String, trim: true }, // Professional summary/bio
});

const experienceSchema = new mongoose.Schema({
    position: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Job', 'Internship', 'Freelance', 'Webinar', 'Volunteering', 'Other'], default: 'Job' },
    location: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true }, // Could be 'Present'
    current: { type: Boolean, default: false }, // Is this the current position?
    description: { type: String, trim: true },
    responsibilities: [{ type: String, trim: true }], // Array of bullet points
    achievements: [{ type: String, trim: true }], // Specific achievements in this role
    salary: { type: String, trim: true }, // Optional
    skills: [{ type: String, trim: true }], // Skills used in this role
});

const educationSchema = new mongoose.Schema({
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    field: { type: String, trim: true },
    location: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    grade: { type: String, trim: true }, // GPA, percentage, or grade
    description: { type: String, trim: true }, // Relevant coursework, honors, etc.
    achievements: [{ type: String, trim: true }], // Academic achievements
});

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    role: { type: String, trim: true }, // Your role in the project
    technologies: [{ type: String, trim: true }], // Tech stack used
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    liveLink: { type: String, trim: true },
    githubLink: { type: String, trim: true },
    features: [{ type: String, trim: true }], // Key features
    teamSize: { type: String, trim: true },
    organization: { type: String, trim: true }, // Company/institution where project was done
});

const achievementSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Award', 'Certification', 'Publication', 'Patent', 'Honor', 'Competition', 'Scholarship', 'Other'], default: 'Certification' },
    issuer: { type: String, trim: true },
    date: { type: String, trim: true },
    description: { type: String, trim: true },
    credentialId: { type: String, trim: true }, // For certifications
    credentialUrl: { type: String, trim: true }, // Verification link
    expiryDate: { type: String, trim: true }, // For certifications that expire
});

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { 
        type: String, 
        enum: ['Technical', 'Programming', 'Framework', 'Tool', 'Soft Skill', 'Language', 'Database', 'Cloud', 'Other'], 
        default: 'Technical' 
    },
    proficiency: { 
        type: String, 
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], 
        default: 'Intermediate' 
    },
    yearsOfExperience: { type: Number },
});

const languageSchema = new mongoose.Schema({
    language: { type: String, required: true, trim: true },
    proficiency: { 
        type: String, 
        enum: ['Native', 'Fluent', 'Professional', 'Intermediate', 'Basic'], 
        required: true 
    },
});

const publicationSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    publisher: { type: String, trim: true }, // Journal/Conference name
    publicationDate: { type: String, trim: true },
    authors: [{ type: String, trim: true }], // Co-authors
    description: { type: String, trim: true },
    url: { type: String, trim: true }, // Link to publication
    doi: { type: String, trim: true }, // Digital Object Identifier
});

const referenceSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    position: { type: String, trim: true },
    company: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    relationship: { type: String, trim: true }, // e.g., "Former Manager"
});

const contactLinkSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ['LinkedIn', 'GitHub', 'Portfolio', 'Website', 'Twitter', 'Facebook', 'Instagram', 'YouTube', 'Medium', 'Blog', 'Behance', 'Dribbble', 'Stack Overflow', 'Other'], 
        default: 'Website' 
    },
    url: { type: String, required: true, trim: true },
    username: { type: String, trim: true }, // For social media handles
});

const volunteeringSchema = new mongoose.Schema({
    organization: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    cause: { type: String, trim: true }, // e.g., "Education", "Environment"
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    current: { type: Boolean, default: false },
    description: { type: String, trim: true },
    achievements: [{ type: String, trim: true }],
});

const customSectionSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true }, // e.g., "Hobbies", "Interests"
    items: [{ type: String, trim: true }], // Array of items in this section
    description: { type: String, trim: true }, // Optional description
});

const informationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    personalDetails: {
        type: personalDetailsSchema,
        default: () => ({}),
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
    skills: {
        type: [skillSchema],
        default: [],
    },
    achievements: {
        type: [achievementSchema],
        default: [],
    },
    publications: {
        type: [publicationSchema],
        default: [],
    },
    languages: {
        type: [languageSchema],
        default: [],
    },
    volunteering: {
        type: [volunteeringSchema],
        default: [],
    },
    references: {
        type: [referenceSchema],
        default: [],
    },
    contactLinks: {
        type: [contactLinkSchema],
        default: [],
    },
    customSections: {
        type: [customSectionSchema],
        default: [],
    },
    // Resume preferences/settings
    preferences: {
        resumeTemplate: { type: String, default: 'modern' }, // Template choice
        colorScheme: { type: String, default: 'blue' },
        fontSize: { type: String, default: 'medium' },
        includePhoto: { type: Boolean, default: false },
        sectionOrder: [{ type: String }], // Custom order of sections
    },
}, {
    timestamps: true,
});

// Add indexes for better query performance
informationSchema.index({ userId: 1 });

const Information = mongoose.model('Information', informationSchema);

module.exports = Information;