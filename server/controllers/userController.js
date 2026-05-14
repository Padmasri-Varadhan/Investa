const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'investa_secret_key_2024';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

/**
 * @desc    Register a new user
 * @route   POST /api/register
 * @access  Public
 */
const registerUser = async (req, res) => {
    try {
        let { name, email, password, preferredLanguage, riskProfile } = req.body;

        // Validate API response/request fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Standardize email format to ensure consistency
        const emailFormatted = String(email).toLowerCase().trim();
        const pwd = String(password);

        // Check if user already exists
        const userExists = await User.findOne({ email: emailFormatted });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create user
        const user = await User.create({ 
            name: String(name).trim(), 
            email: emailFormatted, 
            password: pwd, 
            preferredLanguage,
            riskProfile,
            notifications: [
                {
                    title: 'Welcome to Investa!',
                    message: 'Complete your profile to get personalized advice.',
                    type: 'profile',
                    link: '/profile'
                }
            ]
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            interests: user.interests,
            notifications: user.notifications,
            preferredLanguage: user.preferredLanguage,
            riskProfile: user.riskProfile,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Login user
 * @route   POST /api/login
 * @access  Public
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const emailFormatted = String(email).toLowerCase().trim();
        const pwd = String(password);

        // Find user by email
        const user = await User.findOne({ email: emailFormatted });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Match password
        const isMatch = await user.matchPassword(pwd);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            interests: user.interests,
            notifications: user.notifications,
            preferredLanguage: user.preferredLanguage,
            riskProfile: user.riskProfile,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get user profile
 * @route   GET /api/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Update user goals
 * @route   POST /api/goals
 * @access  Private
 */
const updateGoals = async (req, res) => {
    try {
        const { goals } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { goals },
            { new: true, select: '-password' }
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.name = req.body.name ? String(req.body.name).trim() : user.name;
            user.email = req.body.email ? String(req.body.email).toLowerCase().trim() : user.email;
            user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;
            user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
            user.interests = req.body.interests !== undefined ? req.body.interests : user.interests;
            
            if (req.body.preferredLanguage) {
                user.preferredLanguage = req.body.preferredLanguage;
            }
            if (req.body.riskProfile) {
                user.riskProfile = req.body.riskProfile;
            }
            if (req.body.voiceSearch !== undefined) {
                user.voiceSearch = req.body.voiceSearch;
            }
            if (req.body.aiAssistant !== undefined) {
                user.aiAssistant = req.body.aiAssistant;
            }
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                bio: updatedUser.bio,
                interests: updatedUser.interests,
                notifications: updatedUser.notifications,
                preferredLanguage: updatedUser.preferredLanguage,
                voiceSearch: updatedUser.voiceSearch,
                aiAssistant: updatedUser.aiAssistant,
                riskProfile: updatedUser.riskProfile,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Change user password
 * @route   PUT /api/change-password
 * @access  Private
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id
 * @access  Private
 */
const markNotificationRead = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const notification = user.notifications.id(req.params.id);
        if (notification) {
            notification.read = true;
            await user.save();
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    updateUserProfile, 
    updateGoals, 
    markNotificationRead,
    changePassword
};

