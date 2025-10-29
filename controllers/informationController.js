const Information = require('../models/Information');

// @desc    Get user information
// @route   GET /api/information/:userId
// @access  Private (User can only get their own info)
exports.getInformation = async (req, res) => {
    try {
        // Ensure the authenticated user is requesting their own information
        if (req.user.id !== req.params.userId) {
            return res.status(403).json({ message: 'Not authorized to access this information' });
        }

        const information = await Information.findOne({ userId: req.params.userId });

        if (!information) {
            // If no information found, return a default empty structure
            return res.status(200).json({
                message: 'No information found for this user, returning default structure.',
                information: {
                    userId: req.params.userId,
                    personalDetails: {},
                    experience: [],
                    education: [],
                    projects: [],
                    achievements: [],
                    contactLinks: [],
                }
            });
        }

        res.status(200).json({ information });
    } catch (error) {
        console.error('Error fetching user information:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Save/Update user information
// @route   POST /api/information
// @access  Private (User can only update their own info)
exports.saveInformation = async (req, res) => {
    try {
        const userId = req.user.id; // Get userId from authenticated request
        const information = await Information.findOneAndUpdate({ userId }, req.body, { upsert: true, new: true, runValidators: true });
        res.status(200).json({ message: 'Information saved successfully', information });
    } catch (error) {
        console.error('Error saving user information:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};