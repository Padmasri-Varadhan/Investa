const Video = require('../models/Video');

const getVideos = async (req, res) => {
    try {
        const { search, category, level, sort, page = 1, limit = 10 } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        if (category) query.category = category;
        if (level) query.level = level;

        let sortObj = { createdAt: -1 };
        if (sort) {
            const parts = sort.split(',');
            sortObj = { [parts[0]]: parts[1] === '1' ? 1 : -1 };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const videos = await Video.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Video.countDocuments(query);

        res.json({
            data: videos,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        // Intelligent Recommendations
        const Article = require('../models/Article');
        const InvestmentIdea = require('../models/InvestmentIdea');
        
        // 1. Related Videos (same category or shared tags, excluding self)
        const relatedVideos = await Video.find({
            _id: { $ne: video._id },
            $or: [
                { category: video.category },
                { tags: { $in: video.tags } }
            ]
        }).limit(3);

        // 2. Related Articles
        const relatedArticles = await Article.find({
            $or: [
                { category: video.category },
                { tags: { $in: video.tags } }
            ]
        }).limit(3);

        // 3. Related Investment Ideas
        const relatedIdeas = await InvestmentIdea.find({
            $or: [
                { category: video.category }
            ]
        }).limit(3);

        res.json({
            video,
            relatedVideos,
            relatedArticles,
            relatedIdeas
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getVideos, getVideoById };
