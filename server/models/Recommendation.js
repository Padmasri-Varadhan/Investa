const mongoose = require('mongoose');

/**
 * Recommendation Model
 * Stores investment recommendations based on user risk profiles
 */
const recommendationSchema = new mongoose.Schema(
    {
        profileType: {
            type: String,
            required: true,
            enum: ['Conservative', 'Moderate', 'Aggressive'],
        },
        suggestedAssets: [
            {
                assetName: String,
                allocation: Number,
                description: String,
            }
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Recommendation', recommendationSchema);
