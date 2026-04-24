const Recommendation = require('../models/Recommendation');

const dummyRecommendations = [
    {
        profileType: 'Conservative',
        suggestedAssets: [
            { assetName: 'Government Bonds', allocation: 60, description: 'Low risk, stable returns.' },
            { assetName: 'Gold', allocation: 10, description: 'Safe haven asset.' },
            { assetName: 'Index Funds', allocation: 30, description: 'Broad market exposure with moderate risk.' },
        ]
    },
    {
        profileType: 'Moderate',
        suggestedAssets: [
            { assetName: 'Stocks', allocation: 50, description: 'Growth potential with moderate risk.' },
            { assetName: 'Bonds', allocation: 30, description: 'Stability and income.' },
            { assetName: 'Real Estate (REITs)', allocation: 20, description: 'Diversification and rental income.' },
        ]
    },
    {
        profileType: 'Aggressive',
        suggestedAssets: [
            { assetName: 'Growth Stocks', allocation: 60, description: 'High growth potential, high volatility.' },
            { assetName: 'Cryptocurrency', allocation: 15, description: 'High risk, speculative gains.' },
            { assetName: 'Tech ETFs', allocation: 25, description: 'Focused on industrial innovation.' },
        ]
    }
];

/**
 * @desc    Get recommendations based on profile
 * @route   GET /api/recommendations/:profileType
 * @access  Private
 */
const getRecommendations = async (req, res) => {
    try {
        const { profileType } = req.params;
        let recommendation = await Recommendation.findOne({ profileType });

        if (!recommendation) {
            // Seed if empty
            const count = await Recommendation.countDocuments();
            if (count === 0) {
                await Recommendation.insertMany(dummyRecommendations);
                recommendation = await Recommendation.findOne({ profileType });
            }
            
            if (!recommendation) {
                return res.status(404).json({ message: 'No recommendations found for this profile' });
            }
        }

        res.json(recommendation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getRecommendations };
