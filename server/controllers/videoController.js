const Video = require('../models/Video');

const getVideos = async (req, res) => {
    try {
        const { search, category, level, sort, page = 1, limit = 10 } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } }
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
        res.json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getVideos, getVideoById };
