const Article = require('../models/Article');

// Dummy data seeded on first fetch
const dummyArticles = [
    {
        title: 'Getting Started with Stock Market Investing',
        content: `The stock market can seem intimidating at first, but with the right knowledge and approach, anyone can start investing. In this comprehensive guide, we'll walk you through everything you need to know to begin your investment journey.\n\nUnderstanding stocks is the first step. A stock represents a share of ownership in a company. When you buy a stock, you're buying a small piece of that company. As the company grows and becomes more profitable, the value of your shares can increase.\n\nDiversification is key to managing risk. Don't put all your eggs in one basket. Spread your investments across different sectors, company sizes, and even geographies. This helps protect your portfolio from significant losses if one sector underperforms.\n\nStart with index funds if you're a beginner. Index funds track a market index like the S&P 500, giving you automatic diversification at a low cost. They're a great way to get started without needing to pick individual stocks.`,
        summary: 'Learn the fundamentals of stock market investing and how to build your first portfolio with confidence.',
        author: 'Sarah Johnson',
        category: 'stocks',
        tags: ['beginner', 'stocks', 'portfolio'],
        readTime: 8,
        likes: 234,
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    },
    {
        title: 'Understanding ETFs: The Smart Investor\'s Choice',
        content: `Exchange-Traded Funds (ETFs) have revolutionized investing by offering the diversification of mutual funds with the trading flexibility of stocks. They trade on exchanges just like individual stocks, but they hold a collection of assets.\n\nOne of the biggest advantages of ETFs is their low expense ratios compared to actively managed mutual funds. This cost efficiency can significantly impact your long-term returns due to the power of compounding.\n\nETFs come in many varieties: broad market ETFs, sector ETFs, bond ETFs, commodity ETFs, and more. This gives investors the ability to gain exposure to virtually any market segment with a single purchase.\n\nFor most investors, a portfolio built around a few core ETFs covering different asset classes provides an excellent foundation. Consider a total market ETF, an international ETF, and a bond ETF to start.`,
        summary: 'Discover why ETFs are becoming the preferred investment vehicle for both beginners and experienced investors.',
        author: 'Michael Chen',
        category: 'etf',
        tags: ['etf', 'diversification', 'passive investing'],
        readTime: 6,
        likes: 189,
        imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800',
    },
    {
        title: 'Cryptocurrency: Risk, Reward, and Reality',
        content: `Cryptocurrency has taken the financial world by storm, offering both extraordinary opportunities and significant risks. Understanding the crypto landscape is essential before investing in this volatile asset class.\n\nBitcoin, Ethereum, and thousands of altcoins represent a new paradigm of decentralized finance. Blockchain technology underpins these digital assets, offering transparency and security through distributed ledger technology.\n\nThe key to investing in crypto is understanding that it's a high-risk, high-reward asset class. Many financial advisors recommend allocating only 1-5% of your portfolio to cryptocurrency, treating it as a speculative investment rather than a core holding.\n\nDollar-cost averaging (DCA) is particularly effective in volatile markets like crypto. By investing a fixed amount regularly regardless of price, you reduce the impact of volatility and avoid the temptation of timing the market.`,
        summary: 'Navigate the volatile world of cryptocurrency with strategies to manage risk while capturing potential upside.',
        author: 'Alex Rodriguez',
        category: 'crypto',
        tags: ['crypto', 'bitcoin', 'blockchain', 'risk'],
        readTime: 7,
        likes: 312,
        imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    },
    {
        title: 'Real Estate Investment for Beginners',
        content: `Real estate has long been considered one of the most reliable wealth-building assets. Unlike stocks, real estate provides tangible value, potential rental income, and tax advantages that make it an attractive investment.\n\nFor those who can't afford direct property ownership, Real Estate Investment Trusts (REITs) offer an accessible alternative. REITs are companies that own income-producing real estate and are required to distribute at least 90% of taxable income to shareholders as dividends.\n\nThe key metrics to evaluate real estate investments include cap rate (net operating income divided by property value), cash-on-cash return, and gross rent multiplier. Understanding these metrics helps you evaluate whether a property is a good investment.\n\nLocation remains the most critical factor in real estate investing. Properties in growing job markets, good school districts, and areas with infrastructure development tend to appreciate more over time.`,
        summary: 'Explore real estate investment strategies including REITs, rental properties, and how to evaluate opportunities.',
        author: 'Emily Watson',
        category: 'real_estate',
        tags: ['real estate', 'REITs', 'passive income'],
        readTime: 9,
        likes: 167,
        imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    },
    {
        title: 'Bond Investing: The Art of Fixed Income',
        content: `Bonds are often overlooked by new investors in favor of more exciting assets, but they play a crucial role in a balanced portfolio. Understanding bonds can help you reduce risk and generate steady income.\n\nA bond is essentially a loan you make to a government or corporation in exchange for regular interest payments and the return of principal at maturity. Government bonds are generally the safest, while corporate bonds offer higher yields with more risk.\n\nThe relationship between bond prices and interest rates is inverse – when rates rise, bond prices fall, and vice versa. This is crucial knowledge for timing your bond investments and managing duration risk in your portfolio.\n\nFor most investors, bond funds are more practical than individual bonds. They provide diversification across many bonds and have professional management to navigate the complex fixed income market.`,
        summary: 'Master the fundamentals of bond investing and learn how fixed income securities can stabilize your portfolio.',
        author: 'David Park',
        category: 'bonds',
        tags: ['bonds', 'fixed income', 'government bonds'],
        readTime: 7,
        likes: 143,
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
    },
    {
        title: 'The Power of Compound Interest in Long-Term Investing',
        content: `Albert Einstein allegedly called compound interest the eighth wonder of the world, and for good reason. Understanding and harnessing compound interest is perhaps the most important concept in personal finance and investing.\n\nCompound interest works by earning returns not just on your initial investment, but on all of the accumulated gains as well. The longer your investment timeline, the more powerful this effect becomes. Starting to invest early, even with small amounts, can lead to dramatically better outcomes than starting later with larger sums.\n\nThe Rule of 72 is a simple way to estimate how long it takes for an investment to double. Simply divide 72 by your expected annual return. At 8% annual returns, your investment doubles every 9 years. At 10%, every 7.2 years.\n\nConsistency beats timing when it comes to long-term investing. Regular contributions through market ups and downs, combined with compound interest, is one of the most reliable wealth-building strategies available to ordinary investors.`,
        summary: 'Discover how compound interest works and why starting early is the most powerful advantage in investing.',
        author: 'Rachel Kim',
        category: 'general',
        tags: ['compound interest', 'long-term', 'wealth building'],
        readTime: 5,
        likes: 421,
        imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
    },
];

/**
 * @desc    Get all articles (seeds dummy data if empty)
 * @route   GET /api/articles
 * @access  Public
 */
const getArticles = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        
        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { summary: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } },
                    { tags: { $in: [new RegExp(search, 'i')] } }
                ]
            };
        }

        let articles = await Article.find(query).sort({ createdAt: -1 });

        // Seed dummy data if no articles exist and no search is performed
        if (articles.length === 0 && !search) {
            articles = await Article.insertMany(dummyArticles);
        }

        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get single article
 * @route   GET /api/articles/:id
 * @access  Public
 */
const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Create a new article
 * @route   POST /api/articles
 * @access  Private
 */
const createArticle = async (req, res) => {
    try {
        console.log('Incoming article data:', req.body); // Debugging backend received data
        const article = await Article.create(req.body);
        res.status(201).json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Update an article
 * @route   PUT /api/articles/:id
 * @access  Private
 */
const updateArticle = async (req, res) => {
    try {
        console.log('Update article data for ID:', req.params.id, 'Data:', req.body); // Debugging backend update data
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Delete an article
 * @route   DELETE /api/articles/:id
 * @access  Private
 */
const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        await article.deleteOne();
        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getArticles, getArticleById, createArticle, updateArticle, deleteArticle };
