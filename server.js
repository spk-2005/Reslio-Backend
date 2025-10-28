require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const authRoutes = require('./routes/auth');
const templateRoutes = require('./routes/templates');
const resumeRoutes = require('./routes/resumes');
const portfolioRoutes = require('./routes/portfolios');
const exportRoutes = require('./routes/export');

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
      templates: '/api/templates',
      resumes: '/api/resumes',
      portfolios: '/api/portfolios',
      export: '/api/export',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/export', exportRoutes);

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
