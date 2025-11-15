const Information = require('../models/Information');

// @desc    Get user information
// @route   GET /api/information
// @access  Private
const getInformation = async (req, res) => {
    try {
        console.log('📥 GET /api/information - User ID:', req.user?._id); // req.user is now the full user object
        
        if (!req.user || !req.user._id) {
            console.error('❌ No user ID in request');
            return res.status(401).json({
                success: false,
                message: 'Unauthorized - No user ID'
            });
        }
        const userId = req.user._id;
        const information = await Information.findOne({ userId });

        if (!information) {
            console.log('ℹ️ No information found, returning default structure');
            return res.status(200).json({
                success: true,
                message: 'No information found for this user',
                information: {
                    userId: userId,
                    personalDetails: {
                        name: '',
                        phone: '',
                        location: ''
                    },
                    experience: [],
                    education: [],
                    projects: [],
                    achievements: [],
                    contactLinks: [],
                }
            });
        }

        console.log('✅ Information found:', information._id);
        
        // Convert to plain object to ensure proper serialization
        const infoObject = information.toObject();
        
        // Ensure personalDetails exists as an object
        if (!infoObject.personalDetails) {
            infoObject.personalDetails = {
                name: '',
                phone: '',
                location: ''
            };
        }
        
        console.log('📤 Sending response with personalDetails:', infoObject.personalDetails);
        
        return res.status(200).json({ 
            success: true,
            information: infoObject
        });
        
    } catch (error) {
        console.error('❌ Error in getInformation:', error);
        console.error('❌ Error stack:', error.stack);
        
        return res.status(500).json({ 
            success: false,
            message: 'Server error',
            error: error.message 
        });
    }
};

// @desc    Save/Update user information
// @route   PUT /api/information
// @access  Private
const saveInformation = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log('📥 PUT /api/information - User ID:', userId);
        console.log('📥 Request body:', JSON.stringify(req.body, null, 2));
        
        let information = await Information.findOne({ userId });
        
        if (!information) {
            // Create new information document
            console.log('📝 Creating new information document');
            information = new Information({
                userId,
                personalDetails: {
                    name: '',
                    phone: '',
                    location: ''
                },
                experience: [],
                education: [],
                projects: [],
                achievements: [],
                contactLinks: [],
                ...req.body
            });
        } else {
            // Update existing document
            console.log('📝 Updating existing information document');
            
            // Handle personalDetails specially to merge
            if (req.body.personalDetails) {
                information.personalDetails = {
                    ...information.personalDetails,
                    ...req.body.personalDetails
                };
            }
            
            // Update arrays (complete replacement)
            if (req.body.experience !== undefined) {
                information.experience = req.body.experience;
            }
            if (req.body.education !== undefined) {
                information.education = req.body.education;
            }
            if (req.body.projects !== undefined) {
                information.projects = req.body.projects;
            }
            if (req.body.achievements !== undefined) {
                information.achievements = req.body.achievements;
            }
            if (req.body.contactLinks !== undefined) {
                information.contactLinks = req.body.contactLinks;
            }
        }
        
        await information.save();
        
        console.log('✅ Information saved successfully');
        
        const infoObject = information.toObject();
        
        return res.status(200).json({ 
            success: true,
            message: 'Information saved successfully', 
            information: infoObject
        });
    } catch (error) {
        console.error('❌ Error saving user information:', error);
        console.error('❌ Error details:', error.message);
        
        return res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
};

module.exports = {
    getInformation,
    saveInformation
};