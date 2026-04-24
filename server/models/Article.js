const mongoose = require('mongoose');

/**
 * Article Model
 * Stores investment blog articles
 */
const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        summary: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        author: {
            type: String,
            required: [true, 'Author is required'],
            trim: true,
        },
        category: {
            type: String,
            enum: ['stocks', 'bonds', 'crypto', 'real_estate', 'etf', 'general'],
            default: 'general',
        },
        tags: [String],
        imageUrl: {
            type: String,
            default: '',
        },
        readTime: {
            type: Number,
            default: 5,
        },
        likes: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Article', articleSchema);
