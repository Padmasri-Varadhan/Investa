const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    updateUserProfile, 
    updateGoals, 
    markNotificationRead,
    changePassword 
} = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/change-password', protect, changePassword);
router.post('/goals', protect, updateGoals);
router.put('/notifications/:id', protect, markNotificationRead);

module.exports = router;
