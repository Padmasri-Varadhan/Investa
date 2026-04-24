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
            default: 'General',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Goal', goalSchema);
