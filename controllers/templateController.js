const Template = require('../models/Template');

exports.getAllTemplates = async (req, res) => {
  try {
    const { type } = req.query;
    const query = { isActive: true };

    if (type) {
      query.type = type;
    }

    const templates = await Template.find(query).sort({ createdAt: -1 });

    if (!templates || templates.length === 0) {
      // It's better to return an empty array than a 404 if no templates are found for a given type.
      return res.status(200).json({
        success: true,
        templates: [],
      });
    }

    res.status(200).json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error('Template fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch templates',
    });
  }
};

exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found',
      });
    }

    res.status(200).json({
      success: true,
      template,
    });
  } catch (error) {
    console.error('Template fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch template',
    });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const template = await Template.create(req.body);

    res.status(201).json({
      success: true,
      template,
    });
  } catch (error) {
    console.error('Template creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create template',
    });
  }
};
