require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { authenticateUser } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const templateRoutes = require('./routes/templates');
const userRoutes = require('./routes/users');
const resumeRoutes = require('./routes/resumes');
const portfolioRoutes = require('./routes/portfolios');
const exportRoutes = require('./routes/export');
const informationRoutes = require('./routes/information');
const profileRoutes = require('./routes/profile');
const documentAnalysisRoutes = require('./routes/document-analysis');

const app = express();

connectDB();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => {
  res.json({
    message: 'Reslio API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      templates: '/api/templates',
      profile: '/api/profile',
      resumes: '/api/resumes',
      portfolios: '/api/portfolios',
      export: '/api/export',
      document: '/api/document',
    },
  });
});

// Public routes (no authentication required)
app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/document', documentAnalysisRoutes);

// Protected routes (authentication required)
app.use('/api/users', authenticateUser, userRoutes); // 👈 FIXED!
app.use('/api/resumes', authenticateUser, resumeRoutes);
app.use('/api/portfolios', authenticateUser, portfolioRoutes);
app.use('/api/profile', authenticateUser, profileRoutes);
app.use('/api/information', authenticateUser, informationRoutes);
app.use('/api/export', authenticateUser, exportRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔑 Google API Key configured: ${!!process.env.GOOGLE_API_KEY}`);
});

module.exports = app;