require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { authenticateUser } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const templateRoutes = require('./routes/templates'); // Simple import now
const userRoutes = require('./routes/users');
const resumeRoutes = require('./routes/resumes');
const portfolioRoutes = require('./routes/portfolios');
const exportRoutes = require('./routes/export');
const informationRoutes = require('./routes/information');
const profileRoutes = require('./routes/profile');
const documentAnalysisRoutes = require('./routes/document-analysis');

const app = express();

connectDB();

app.use(cors());
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
    },
  });
});

// Create a dedicated router for protected routes
const protectedRouter = express.Router();

// Apply the authentication middleware to this router
protectedRouter.use(authenticateUser);

// Mount all protected routes onto the protectedRouter
protectedRouter.use('/resumes', resumeRoutes);
protectedRouter.use('/portfolios', portfolioRoutes);
protectedRouter.use('/profile', profileRoutes);
protectedRouter.use('/information', informationRoutes);
protectedRouter.use('/export', exportRoutes);
protectedRouter.use('/document', documentAnalysisRoutes);

// Mount all routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/templates', templateRoutes); // No auth required
app.use('/api', protectedRouter); // Mount the protected router under /api

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
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;