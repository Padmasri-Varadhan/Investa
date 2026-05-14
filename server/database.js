const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./models/User');
const KnowledgeBase = require('./models/KnowledgeBase');
const Holding = require('./models/Holding');
const Transaction = require('./models/Transaction');

const seedData = async () => {
    try {
        const demoEmail = 'demo@investa.com';
        let demoUser = await User.findOne({ email: demoEmail });
        
        if (!demoUser) {
            console.log('🌱 Seeding demo user...');
            demoUser = await User.create({
                name: 'Demo User',
                email: demoEmail,
                password: 'demo1234',
                preferredLanguage: 'English',
                riskProfile: 'Moderate',
                aiAssistant: true
            });
            console.log('✅ Demo user seeded: demo@investa.com / demo1234');
        }

        // Seed KnowledgeBase
        const kbExists = await KnowledgeBase.countDocuments();
        if (kbExists === 0) {
            console.log('🌱 Seeding KnowledgeBase...');
            await KnowledgeBase.create([
                // --- FINANCIAL KNOWLEDGE ---
                { 
                    intent: 'etf', 
                    keywords: ['etf', 'exchange traded fund', 'funds'], 
                    title: 'Exchange-Traded Funds (ETFs)', 
                    content: '### 🔗 What is an ETF?\nAn **Exchange-Traded Fund (ETF)** is a basket of securities (like stocks or bonds) that trades on an exchange just like an individual stock. \n\n**Key Benefits:**\n*   **Diversification**: One ETF can give you exposure to hundreds of companies.\n*   **Low Cost**: Generally lower expense ratios than mutual funds.\n*   **Liquidity**: Can be bought and sold throughout the trading day.\n\n**Example:** The S&P 500 ETF (SPY) tracks the performance of the 500 largest US companies.',
                    category: 'Assets' 
                },
                { 
                    intent: 'sip', 
                    keywords: ['sip', 'systematic investment', 'monthly investment', 'recurring'], 
                    title: 'Systematic Investment Plan (SIP)', 
                    content: '### 💰 Understanding SIP\nA **Systematic Investment Plan (SIP)** is a disciplined approach to investing where you invest a fixed amount of money at regular intervals (usually monthly). \n\n**Why choose SIP?**\n1.  **Rupee Cost Averaging**: You buy more units when prices are low and fewer when prices are high.\n2.  **Power of Compounding**: Regular small investments grow significantly over time.\n3.  **Financial Discipline**: Automates your savings habit.\n\n**Tip:** Even ₹500 a month can grow into a large corpus over 15-20 years!',
                    category: 'Strategies' 
                },
                { 
                    intent: 'stocks', 
                    keywords: ['stock', 'equity', 'shares', 'share market'], 
                    title: 'Stock Market Basics', 
                    content: '### 📈 What are Stocks?\nBuying a **Stock** (or share) means you own a small piece of a company. As the company grows and becomes more profitable, your shares can increase in value.\n\n**How to start?**\n*   **Research**: Look for companies with strong fundamentals.\n*   **Diversify**: Don\'t put all your money in one company.\n*   **Long-term**: Stocks are best suited for a 5+ year horizon.\n\n**Note:** Stocks carry higher risk but offer higher potential returns compared to debt.',
                    category: 'Assets' 
                },
                { 
                    intent: 'crypto', 
                    keywords: ['crypto', 'bitcoin', 'btc', 'ethereum', 'eth', 'blockchain'], 
                    title: 'Cryptocurrency Basics', 
                    content: '### ₿ Crypto 101\n**Cryptocurrency** is a digital or virtual currency secured by cryptography, making it nearly impossible to counterfeit. Most run on **Blockchain** technology.\n\n**Common Assets:**\n*   **Bitcoin (BTC)**: Often called "Digital Gold".\n*   **Ethereum (ETH)**: A platform for decentralized applications.\n\n**Warning:** Crypto is highly volatile. Never invest more than you can afford to lose.',
                    category: 'Assets' 
                },
                { 
                    intent: 'diversification', 
                    keywords: ['diversify', 'diversification', 'risk management', 'spread risk'], 
                    title: 'Portfolio Diversification', 
                    content: '### 🛡️ Why Diversify?\n**Diversification** is the practice of spreading your investments across various asset classes (stocks, bonds, gold, real estate) to reduce risk.\n\n**How it works:**\nIf one asset class performs poorly (e.g., stocks crash), another might perform well (e.g., gold rises), protecting your overall portfolio.\n\n**The Golden Rule:** Don\'t put all your eggs in one basket!',
                    category: 'Strategies' 
                },
                { 
                    intent: 'tax_saving', 
                    keywords: ['tax', 'income tax', '80c', 'save tax', 'elss'], 
                    title: 'Tax Saving Investments', 
                    content: '### 📑 Save Tax Smartly\nYou can reduce your taxable income using specific investment instruments (under Section 80C in India).\n\n**Top Options:**\n*   **ELSS (Equity Linked Savings Scheme)**: 3-year lock-in, high return potential.\n*   **PPF (Public Provident Fund)**: 15-year horizon, safe government-backed.\n*   **NPS (National Pension System)**: Great for retirement planning.\n\n**Goal:** Aim to maximize your ₹1.5 Lakh limit every year.',
                    category: 'Planning' 
                },

                // --- WEBSITE KNOWLEDGE ---
                { 
                    intent: 'guided_journey', 
                    keywords: ['guided journey', 'how to start', 'journey module', 'recommendation'], 
                    title: 'Guided Journey Feature', 
                    content: '### 🚀 What is Guided Journey?\nThe **Guided Journey** is our flagship module designed to take the guesswork out of investing. \n\n**How to use it:**\n1.  Answer a few questions about your risk tolerance.\n2.  We analyze your profile.\n3.  We provide a **personalized investment recommendation** tailored just for you.\n\nIt\'s the best place to start if you are a beginner!',
                    category: 'Website' 
                },
                { 
                    intent: 'my_goals', 
                    keywords: ['my goals', 'goal', 'add goal', 'delete goal', 'track goal'], 
                    title: 'My Goals Management', 
                    content: '### 🎯 Goal Tracking\nThe **My Goals** page helps you visualize your financial dreams (like buying a car, retirement, or a vacation).\n\n**Features:**\n*   **Add Goal**: Click the "Add New Goal" button.\n*   **Track Progress**: See exactly how close you are to your target.\n*   **Delete Goal**: You can remove goals via the "Edit" or "Delete" options on the goal card.\n\nTracking goals keeps you motivated to save!',
                    category: 'Website' 
                },
                { 
                    intent: 'dashboard', 
                    keywords: ['dashboard', 'overview', 'summary', 'home page'], 
                    title: 'Investa Dashboard', 
                    content: '### 📊 Dashboard Overview\nYour **Dashboard** is your financial command center. It shows:\n\n*   **Portfolio Summary**: Total value and asset allocation.\n*   **Growth Chart**: Your portfolio performance over time.\n*   **Recent Transactions**: See your latest buys and sells.\n*   **Goal Progress**: Quick look at your top goals.\n\nCheck it daily to stay on top of your finances!',
                    category: 'Website' 
                },
                { 
                    intent: 'investment_ideas', 
                    keywords: ['investment ideas', 'ideas', 'filter', 'search ideas'], 
                    title: 'Investment Ideas', 
                    content: '### 💡 Finding Ideas\nThe **Investment Ideas** page provides curated investment opportunities across different risk levels.\n\n**How to use filters:**\n*   Use the **Risk Filter** (Low, Medium, High) to match your profile.\n*   Use the **Category Filter** to find specific assets like ETFs or Stocks.\n*   Use the **Search Bar** to find specific companies or themes.',
                    category: 'Website' 
                },
                { 
                    intent: 'video_advisory', 
                    keywords: ['video', 'videos', 'advisory', 'learning videos', 'watch'], 
                    title: 'Video Advisory', 
                    content: '### 🎥 Learn via Video\nOur **Video Advisory** section offers high-quality financial education videos from experts.\n\n**How it works:**\n*   Browse by level (Beginner, Intermediate, Advanced).\n*   Click a video to watch it in our premium player.\n*   Read the description and key takeaways below each video.\n\nLearning has never been this cinematic!',
                    category: 'Website' 
                },
                { 
                    intent: 'chatbot_module', 
                    keywords: ['chatbot', 'ai assistant', 'how to use chatbot', 'ask questions'], 
                    title: 'Investa AI Chatbot', 
                    content: '### 🤖 Chatbot Assistant\nThat\'s me! I\'m here to help you navigate the app and understand financial concepts.\n\n**What I can do:**\n*   Explain financial terms (like SIP, ETF).\n*   Show your **Portfolio Value** and **Goal Progress**.\n*   Explain how to use different parts of the website.\n*   Provide context-aware follow-up answers.\n\nJust type your question below!',
                    category: 'Website' 
                }
            ]);
        }

        // Seed some Portfolio data for demo user
        const holdingsExist = await Holding.countDocuments({ userId: demoUser._id });
        if (holdingsExist === 0) {
            console.log('🌱 Seeding sample portfolio...');
            await Holding.create([
                { userId: demoUser._id, name: 'S&P 500 ETF', symbol: 'SPY', quantity: 15, averagePrice: 420, currentPrice: 485, assetType: 'ETF' },
                { userId: demoUser._id, name: 'Bitcoin', symbol: 'BTC', quantity: 0.8, averagePrice: 38000, currentPrice: 62000, assetType: 'Crypto' },
                { userId: demoUser._id, name: 'HDFC Bank', symbol: 'HDFCBANK', quantity: 50, averagePrice: 1450, currentPrice: 1520, assetType: 'Stock' },
                { userId: demoUser._id, name: 'Gold ETF', symbol: 'GOLD', quantity: 100, averagePrice: 55, currentPrice: 62, assetType: 'ETF' }
            ]);
            await Transaction.create([
                { userId: demoUser._id, type: 'Buy', assetName: 'S&P 500 ETF', amount: 6300, quantity: 15, priceAtTransaction: 420, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), status: 'Completed' },
                { userId: demoUser._id, type: 'Buy', assetName: 'Bitcoin', amount: 30400, quantity: 0.8, priceAtTransaction: 38000, date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), status: 'Completed' },
                { userId: demoUser._id, type: 'Buy', assetName: 'HDFC Bank', amount: 72500, quantity: 50, priceAtTransaction: 1450, date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), status: 'Completed' }
            ]);
        }

        // Seed Sample Goals for "My Goals" and "Consistency Sidebar"
        const Goal = require('./models/Goal');
        console.log('🌱 Seeding sample investment goals...');
        await Goal.deleteMany({ userId: demoUser._id });
        
        const investCategories = [
            'Public Provident Fund (PPF)', 'National Pension System (NPS)', 
            'REITs (Real Estate)', 'Gold Investment', 'Corporate Bonds', 
            'Fixed Deposit (FD)', 'International Investments', 'Treasury Bills'
        ];
        
        const sampleGoals = [
            { title: 'Emergency Fund', type: investCategories[0], progress: 20, current: 2000, target: 10000 },
            { title: 'Retirement Corpus', type: investCategories[1], progress: 50, current: 5000, target: 10000 },
            { title: 'Passive Income REITs', type: investCategories[2], progress: 75, current: 7500, target: 10000 },
            { title: 'Wealth Protection Gold', type: investCategories[3], progress: 90, current: 9000, target: 10000 }
        ];

        await Goal.create(sampleGoals.map(sg => ({
            userId: demoUser._id,
            title: sg.title,
            type: sg.type,
            category: 'Investment',
            difficulty: 'Intermediate',
            progress: sg.progress,
            currentAmount: sg.current,
            targetAmount: sg.target,
            deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            status: 'on_track'
        })));

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    }
};

/**
 * Auto-seed Articles and Investment Ideas from JSON files if collections are empty.
 * This runs inside the server process so it works with both real and in-memory MongoDB.
 */
const seedContentData = async () => {
    const fs = require('fs');
    const path = require('path');
    const Article = require('./models/Article');
    const InvestmentIdea = require('./models/InvestmentIdea');
    const Video = require('./models/Video');

    const seedDir = path.join(__dirname, 'seed');

    // Seed Articles
    try {
        const articleCount = await Article.countDocuments();
        if (articleCount === 0) {
            const filePath = path.join(seedDir, 'articles.json');
            if (fs.existsSync(filePath)) {
                const articles = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                await Article.insertMany(articles);
                console.log(`✅ Auto-seeded ${articles.length} Articles from JSON`);
            } else {
                console.warn('⚠️  articles.json not found. Run: node seed/generateSeeds.js');
            }
        } else {
            console.log(`ℹ️  Articles collection already has ${articleCount} documents — skipping seed`);
        }
    } catch (err) {
        console.error('❌ Failed to auto-seed articles:', err.message);
    }

    // Seed Investment Ideas
    try {
        const ideaCount = await InvestmentIdea.countDocuments();
        if (ideaCount === 0) {
            const filePath = path.join(seedDir, 'investmentIdeas.json');
            if (fs.existsSync(filePath)) {
                const ideas = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                await InvestmentIdea.insertMany(ideas);
                console.log(`✅ Auto-seeded ${ideas.length} Investment Ideas from JSON`);
            } else {
                console.warn('⚠️  investmentIdeas.json not found. Run: node seed/generateSeeds.js');
            }
        } else {
            console.log(`ℹ️  Investment Ideas collection already has ${ideaCount} documents — skipping seed`);
        }
    } catch (err) {
        console.error('❌ Failed to auto-seed investment ideas:', err.message);
    }

    // Seed Videos
    try {
        const videoCount = await Video.countDocuments();
        if (videoCount === 0) {
            const filePath = path.join(seedDir, 'videos.json');
            if (fs.existsSync(filePath)) {
                const videos = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                await Video.insertMany(videos);
                console.log(`✅ Auto-seeded ${videos.length} Videos from JSON`);
            } else {
                console.warn('⚠️  videos.json not found. Run: node seed/generateSeeds.js');
            }
        } else {
            console.log(`ℹ️  Videos collection already has ${videoCount} documents — skipping seed`);
        }
    } catch (err) {
        console.error('❌ Failed to auto-seed videos:', err.message);
    }
};

/**
 * Connect to MongoDB or fall back to an in-memory database
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/investa',
            { serverSelectionTimeoutMS: 2000 }
        );
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        await seedData();
        await seedContentData();
        return true;
    } catch (error) {
        console.warn(`⚠️  Primary MongoDB not connected: ${error.message}`);
        console.warn('   Falling back to mongodb-memory-server...');
        try {
            const mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
            console.log(`✅ In-Memory MongoDB Connected at ${uri}`);
            await seedData();
            await seedContentData();
            return true;
        } catch (memError) {
            console.error('Failed to start in-memory DB:', memError);
            return false;
        }
    }
};

module.exports = connectDB;
