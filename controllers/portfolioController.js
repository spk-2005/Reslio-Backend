const Portfolio = require('../models/Portfolio');
const User = require('../models/User');

exports.createPortfolio = async (req, res) => {
  try {
    const { templateId, title, data } = req.body;

    const portfolio = await Portfolio.create({
      userId: req.dbUser._id,
      templateId,
      title: title || 'My Portfolio',
      data,
    });

    await User.findByIdAndUpdate(req.dbUser._id, {
      $push: { createdPortfolios: portfolio._id },
    });

    res.status(201).json({
      success: true,
      portfolio,
    });
  } catch (error) {
    console.error('Portfolio creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create portfolio',
    });
  }
};

exports.getUserPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.dbUser._id })
      .populate('templateId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      portfolios,
    });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolios',
    });
  }
};

exports.getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      userId: req.dbUser._id,
    }).populate('templateId');

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found',
      });
    }

    res.status(200).json({
      success: true,
      portfolio,
    });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolio',
    });
  }
};

exports.updatePortfolio = async (req, res) => {
  try {
    const { title, data } = req.body;

    const portfolio = await Portfolio.findOneAndUpdate(
      { _id: req.params.id, userId: req.dbUser._id },
      { title, data },
      { new: true }
    ).populate('templateId');

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found',
      });
    }

    res.status(200).json({
      success: true,
      portfolio,
    });
  } catch (error) {
    console.error('Portfolio update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update portfolio',
    });
  }
};

exports.deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({
      _id: req.params.id,
      userId: req.dbUser._id,
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found',
      });
    }

    await User.findByIdAndUpdate(req.dbUser._id, {
      $pull: { createdPortfolios: portfolio._id },
    });

    res.status(200).json({
      success: true,
      message: 'Portfolio deleted successfully',
    });
  } catch (error) {
    console.error('Portfolio deletion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete portfolio',
    });
  }
};
