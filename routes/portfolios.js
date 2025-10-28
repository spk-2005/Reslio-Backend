const express = require('express');
const router = express.Router();
const {
  createPortfolio,
  getUserPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
} = require('../controllers/portfolioController');
const { authenticateUser, checkPremium } = require('../middleware/auth');

router.post('/', authenticateUser, createPortfolio);
router.get('/', authenticateUser, getUserPortfolios);
router.get('/:id', authenticateUser, getPortfolioById);
router.put('/:id', authenticateUser, checkPremium, updatePortfolio);
router.delete('/:id', authenticateUser, deletePortfolio);

module.exports = router;
