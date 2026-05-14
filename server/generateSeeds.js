const mongoose = require('mongoose');
const Article = require('./models/Article');
const InvestmentIdea = require('./models/InvestmentIdea');

const categories = ['stocks', 'bonds', 'crypto', 'real_estate', 'etf', 'general'];
const riskLevels = ['low', 'medium', 'high'];
const authors = ['Investa Research', 'Market Insider', 'Financial Guru', 'Eco Investor', 'Property Analyst', 'Debt Strategist'];

const generateArticles = () => {
    const articles = [];
    for (let i = 1; i <= 50; i++) {
        const cat = categories[Math.floor(Math.random() * categories.length)];
        articles.push({
            title: `Investment Trend Analysis #${i}: ${cat.toUpperCase()} Outlook`,
            content: `This is a comprehensive long-form article about ${cat} in 2026. It covers market volatility, institutional adoption, and strategic asset allocation. Portfolio diversification remains the key theme for this quarter as global markets adjust to new interest rate environments.`,
            summary: `A deep dive into the latest trends affecting the ${cat} market.`,
            description: `Expert analysis on ${cat} for the modern investor.`,
            author: authors[Math.floor(Math.random() * authors.length)],
            category: cat,
            tags: [cat, '2026', 'trend', 'analysis'],
            readTime: Math.floor(Math.random() * 10) + 5,
            likes: Math.floor(Math.random() * 100)
        });
    }
    return articles;
};

const generateIdeas = () => {
    const ideas = [];
    const ideaCategories = ['stocks', 'bonds', 'crypto', 'real_estate', 'etf', 'mutual_fund', 'index_fund'];
    for (let i = 1; i <= 50; i++) {
        const risk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
        const cat = ideaCategories[Math.floor(Math.random() * ideaCategories.length)];
        ideas.push({
            title: `Strategy Alpha #${i}: ${cat.toUpperCase()} ${risk.toUpperCase()}`,
            description: `A ${risk}-risk investment strategy focusing on ${cat} assets for optimized returns.`,
            content: `This strategy leverages quantitative analysis and market momentum to identify high-conviction opportunities in ${cat}. Recommended for investors looking for ${risk} exposure.`,
            riskLevel: risk,
            expectedReturn: risk === 'high' ? '20%+' : risk === 'medium' ? '10-15%' : '5-8%',
            category: cat,
            timeHorizon: i % 2 === 0 ? '5-10 years' : '1-3 years',
            pros: ['Diversification', 'Professional Research', 'High Upside'],
            cons: ['Market Volatility', 'Entry Timing'],
            tags: [cat, risk, 'strategy', 'alpha']
        });
    }
    return ideas;
};

async function seed() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/investa');
        console.log('Connected to MongoDB for seeding 50+ items...');
        
        await Article.deleteMany({});
        await InvestmentIdea.deleteMany({});
        
        const articles = generateArticles();
        const ideas = generateIdeas();
        
        await Article.insertMany(articles);
        console.log('✅ 50 Articles seeded successfully!');
        
        await InvestmentIdea.insertMany(ideas);
        console.log('✅ 50 Investment Ideas seeded successfully!');
        
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed (Primary DB not found):', err.message);
        console.log('Falling back to direct injection in database.js...');
        process.exit(1);
    }
}

seed();
