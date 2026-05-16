const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
    },
    riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    image: {
        type: String,
        default: '',
    },
    summary: {
        type: String,
        default: '',
    },
    fullContent: {
        type: String,
        required: [true, 'Full content is required'],
    },
    readTime: {
        type: Number,
        default: 5,
    },
    difficultyLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner',
    },
    author: {
        type: String,
        default: 'Investa Expert Team',
    },
    tags: {
        type: [String],
        default: [],
    },
    relatedArticles: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Article',
        default: [],
    },
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);
