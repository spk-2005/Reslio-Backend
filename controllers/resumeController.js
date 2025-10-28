const Resume = require('../models/Resume');
const User = require('../models/User');

exports.createResume = async (req, res) => {
  try {
    const { templateId, title, data } = req.body;

    const resume = await Resume.create({
      userId: req.dbUser._id,
      templateId,
      title: title || 'Untitled Resume',
      data,
    });

    await User.findByIdAndUpdate(req.dbUser._id, {
      $push: { createdResumes: resume._id },
    });

    res.status(201).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error('Resume creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create resume',
    });
  }
};

exports.getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.dbUser._id })
      .populate('templateId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.error('Resume fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resumes',
    });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.dbUser._id,
    }).populate('templateId');

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found',
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error('Resume fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resume',
    });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const { title, data } = req.body;

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.dbUser._id },
      { title, data },
      { new: true }
    ).populate('templateId');

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found',
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error('Resume update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update resume',
    });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.dbUser._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found',
      });
    }

    await User.findByIdAndUpdate(req.dbUser._id, {
      $pull: { createdResumes: resume._id },
    });

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    console.error('Resume deletion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete resume',
    });
  }
};
