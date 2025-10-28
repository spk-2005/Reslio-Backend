const express = require('express');
const router = express.Router();
const {
  exportResumePDF,
  exportResumeImage,
  exportResumeDOCX,
  exportPortfolioZIP,
} = require('../controllers/exportController');
const { authenticateUser } = require('../middleware/auth');

router.post('/resume/pdf', authenticateUser, exportResumePDF);
router.post('/resume/image', authenticateUser, exportResumeImage);
router.post('/resume/docx', authenticateUser, exportResumeDOCX);
router.post('/portfolio/zip', authenticateUser, exportPortfolioZIP);

module.exports = router;
