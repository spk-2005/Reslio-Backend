const express = require('express');
const router = express.Router();
const {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
} = require('../controllers/resumeController');
const { authenticateUser, checkPremium } = require('../middleware/auth');

router.post('/', authenticateUser, createResume);
router.get('/', authenticateUser, getUserResumes);
router.get('/:id', authenticateUser, getResumeById);
router.put('/:id', authenticateUser, checkPremium, updateResume);
router.delete('/:id', authenticateUser, deleteResume);

module.exports = router;
