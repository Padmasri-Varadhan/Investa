const mongoose = require('mongoose');

/**
 * Goal Model
 * Stores financial goals for users
 */
const goalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        targetAmount: {
            type: Number,
            required: [true, 'Target amount is required'],
        },
        currentAmount: {
            type: Number,
            default: 0,
        },
        deadline: {
            type: Date,
            required: [true, 'Deadline is required'],
        },
        category: {
            type: String,
            default: 'savings',
        },
        type: {
            type: String,
            default: 'General',
        },
        difficulty: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            default: 'Beginner',
        },
        progress: {
            type: Number,
            default: 0,
        },
        streak: {
            type: Number,
            default: 0,
        },
        milestones_count: {
            type: Number,
            default: 0,
        },
        weeklyTarget: {
            type: String,
            default: '',
        },
        monthlyContribution: {
            type: Number,
            default: 0,
        },
        riskPreference: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        investmentType: {
            type: String,
            default: 'Mutual Funds',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        status: {
            type: String,
            enum: ['on_track', 'behind', 'completed', 'paused'],
            default: 'on_track',
        },
        autoInvest: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Goal', goalSchema);
