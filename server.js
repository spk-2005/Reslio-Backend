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

// Mount all routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/templates', templateRoutes); // No auth required

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
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;