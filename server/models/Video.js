const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    thumbnail: {
        type: String,
        default: '',
    },
    videoUrl: {
        type: String,
        required: [true, 'Video URL is required'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner',
    },
    duration: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    advisor: {
        type: String,
        default: 'Investa Expert',
    },
    views: {
        type: String,
        default: '1K',
    },
    tags: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);

