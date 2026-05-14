const Parser = require('rss-parser');
const parser = new Parser();

/**
 * @desc    Get live market news from Yahoo Finance RSS
 * @route   GET /api/news
 * @access  Public
 */
const getMarketNews = async (req, res) => {
    try {
        // Fetch from Yahoo Finance or similar public RSS
        const feed = await parser.parseURL('https://finance.yahoo.com/news/rssindex');
        
        const news = feed.items.map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            content: item.contentSnippet,
            source: 'Yahoo Finance'
        })).slice(0, 10); // Return top 10

        res.json(news);
    } catch (error) {
        console.error('News fetch error:', error);
        // Fallback to dummy news if RSS fails
        res.json([
            {
                title: 'Market Rally Continues as Tech Stocks Surge',
                link: '#',
                pubDate: new Date().toISOString(),
                content: 'Major indices saw significant gains today as investor confidence in AI-driven growth remains strong.',
                source: 'Investa Insights'
            },
            {
                title: 'Federal Reserve Signals Potential Rate Stability',
                link: '#',
                pubDate: new Date().toISOString(),
                content: 'The latest Fed minutes suggest a cautious approach to future interest rate changes.',
                source: 'Investa Insights'
            }
        ]);
    }
};

module.exports = { getMarketNews };
