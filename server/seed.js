const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Article = require('./models/Article');
const InvestmentIdea = require('./models/InvestmentIdea');
const KnowledgeBase = require('./models/KnowledgeBase');

dotenv.config();

const dummyArticles = [
    {
        title: 'Getting Started with Stock Market Investing',
        content: `## Introduction
The stock market is one of the most powerful tools for building long-term wealth. However, for many beginners, the jargon and volatility can be intimidating. This guide aims to demystify the market and provide a clear roadmap for your first steps.

## What is a Stock?
A stock represents fractional ownership in a corporation. When you buy a share, you are literally buying a piece of that business. Companies issue stock to raise money for expansion, and in return, shareholders hope to profit from the company's growth through price appreciation and dividends.

## Why Invest in Stocks?
- **Beating Inflation**: Historically, stocks have provided returns that significantly outpace inflation, preserving your purchasing power.
- **Compounding**: Reinvesting your gains allows your wealth to grow exponentially over time.
- **Dividends**: Many established companies pay out a portion of their profits to shareholders, providing a source of passive income.

## Key Concepts for Beginners
### 1. Diversification
"Don't put all your eggs in one basket." By spreading your investments across different industries (tech, healthcare, energy) and company sizes, you reduce the risk that a single failure will destroy your entire portfolio.

### 2. Risk Tolerance
Every investor is different. Some can stomach 20% drops in exchange for high growth, while others prefer slow, steady progress. Understanding your emotional response to market swings is crucial before you start.

### 3. Long-Term Thinking
The market is volatile in the short term but tends to trend upward over decades. Successful investors focus on years and decades, not days and weeks.

## How to Start
1. **Build an Emergency Fund**: Never invest money you might need in the next 3-6 months.
2. **Open a Brokerage Account**: Choose a platform that offers low fees and educational resources.
3. **Start Small**: You don't need thousands of dollars. Many brokers allow you to buy fractional shares.

## Conclusion
Investing is a marathon, not a sprint. By starting early and staying consistent, you harness the power of the global economy to build your financial future.`,
        summary: 'A comprehensive guide to understanding stocks, managing risk, and building a solid foundation for your investment journey.',
        author: 'Sarah Johnson',
        category: 'stocks',
        tags: ['beginner', 'stocks', 'portfolio', 'education'],
        readTime: 12,
        likes: 1250,
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    },
    {
        title: 'Understanding ETFs: The Smart Investor\'s Choice',
        content: `## Introduction
Exchange-Traded Funds (ETFs) have become the go-to investment vehicle for millions. They offer the diversification of a mutual fund with the ease of trading like a stock.

## What makes ETFs special?
An ETF is a basket of securities—stocks, bonds, or other assets—that trades on an exchange. When you buy one share of an S&P 500 ETF, you are effectively buying a tiny piece of 500 different companies.

## The Advantages of ETFs
- **Low Costs**: Because most ETFs are "passive" (they just follow an index), they have much lower fees than actively managed funds.
- **Transparency**: You can see exactly what assets are inside an ETF at any time.
- **Tax Efficiency**: The way ETFs are structured often results in fewer capital gains taxes for the investor compared to mutual funds.

## Types of ETFs to Know
### 1. Broad Market ETFs
These track major indices like the S&P 500 or the Total Stock Market. They are the "core" of most portfolios.

### 2. Sector ETFs
Focus on specific industries like Technology, Energy, or Healthcare. These allow for more targeted bets.

### 3. Bond ETFs
Provide a steady stream of income by holding various government or corporate bonds.

## Strategy: The "Core and Satellite" Approach
Many successful investors use broad-market ETFs for 80% of their portfolio (the "Core") and use more specific sector or thematic ETFs for the remaining 20% (the "Satellites") to try and boost returns.

## Conclusion
ETFs are arguably the most important innovation in finance for the retail investor. They allow you to achieve professional-grade diversification with a single click.`,
        summary: 'Learn why ETFs are the most efficient way to build a diversified portfolio with low fees and high transparency.',
        author: 'Michael Chen',
        category: 'etf',
        tags: ['etf', 'diversification', 'passive investing', 'wealth'],
        readTime: 10,
        likes: 890,
        imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800',
    },
    {
        title: 'Cryptocurrency: Risk, Reward, and Reality',
        content: `## Introduction
Cryptocurrency is no longer just a niche interest for tech enthusiasts. It has grown into a trillion-dollar asset class that is challenging traditional notions of money and value.

## The Core Technology: Blockchain
At its heart, cryptocurrency is powered by blockchain—a decentralized, digital ledger that records transactions across many computers so that the record cannot be altered retroactively. This provides security and transparency without the need for a central bank.

## Major Players
### Bitcoin (BTC)
Often called "Digital Gold," Bitcoin is the first and largest cryptocurrency. Its main value proposition is its scarcity (only 21 million will ever exist).

### Ethereum (ETH)
More than just a currency, Ethereum is a platform for "Smart Contracts." It allows developers to build decentralized applications (dApps) on top of its blockchain.

## The Realities of Crypto Investing
- **Extreme Volatility**: Prices can swing 10-20% in a single day. This is not for the faint of heart.
- **Security Responsibility**: If you lose your "private keys," your money is gone forever. There is no "forgot password" button in decentralized finance.
- **Regulatory Uncertainty**: Governments are still deciding how to tax and regulate digital assets.

## Strategic Allocation
Most experts suggest a small allocation to crypto—perhaps 1% to 5% of your total portfolio. This gives you exposure to the massive upside potential without risking your entire financial future.

## Conclusion
Cryptocurrency represents a paradigm shift in finance. While the risks are high, the potential for innovation and growth makes it a sector that every modern investor should at least understand.`,
        summary: 'A balanced look at the world of digital assets, from the mechanics of blockchain to the strategies for managing crypto volatility.',
        author: 'Alex Rodriguez',
        category: 'crypto',
        tags: ['crypto', 'bitcoin', 'blockchain', 'risk', 'innovation'],
        readTime: 15,
        likes: 3420,
        imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    },
    {
        title: 'Real Estate Investment for Beginners',
        content: `## Introduction
Real estate has minted more millionaires than almost any other asset class. It provides a unique combination of rental income, tax benefits, and potential for appreciation.

## Ways to Invest
### 1. Physical Property
Buying a home or apartment to rent out. This gives you the most control but requires the most work (and the most capital).

### 2. REITs (Real Estate Investment Trusts)
Companies that own and manage portfolios of real estate. They are traded on the stock exchange, making it easy to invest in real estate with as little as $100.

### 3. Crowdfunding
Pooling your money with other investors to fund large-scale commercial projects like hotels or office buildings.

## The Benefits of Real Estate
- **Passive Income**: Monthly rent checks can provide a steady stream of cash.
- **Leverage**: You can use the bank's money (a mortgage) to buy an asset, which can multiply your returns on your initial investment.
- **Tax Advantages**: Depreciation and other deductions can significantly reduce the tax you pay on your rental income.

## Key Metrics to Watch
- **Cap Rate**: The annual return on the property's value.
- **Cash-on-Cash Return**: The annual cash flow divided by the actual cash you invested.
- **Location**: Always the most important factor. Look for areas with growing populations and strong job markets.

## Conclusion
Real estate is a "tangible" asset that provides a great hedge against stock market volatility. Whether through REITs or direct ownership, it belongs in every balanced portfolio.`,
        summary: 'Explore the different ways to enter the real estate market, from direct ownership to accessible REITs and crowdfunding.',
        author: 'Emily Watson',
        category: 'real_estate',
        tags: ['real estate', 'REITs', 'passive income', 'property'],
        readTime: 14,
        likes: 750,
        imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    }
];

const dummyIdeas = [
    {
        title: 'S&P 500 Index Fund',
        description: 'The "Gold Standard" of long-term investing. Own the 500 largest companies in the United States with one single purchase.',
        content: `## Strategy Overview
The S&P 500 represents approximately 80% of the total value of the US stock market. By investing in an index fund that tracks it, you are betting on the continued growth of the American economy.

## Why this is a Core Holding
- **Instant Diversification**: You get exposure to 11 different sectors, from Tech to Healthcare.
- **Low Effort**: No need to research individual stocks or time the market.
- **Historic Performance**: Over the last 50 years, the S&P 500 has averaged about 10% annual returns.

## How to Implement
You can buy this through ETFs like **VOO** (Vanguard) or **SPY** (SPDR). Simply set up a recurring monthly purchase and let the power of compounding do the work over decades.

## Ideal For
Investors who want a reliable, low-maintenance way to build wealth over the next 10-30 years.`,
        riskLevel: 'low',
        expectedReturn: '8-10% annually',
        expectedReturns: '8-10% annually',
        timeHorizon: '5+ years',
        investmentHorizon: 'long_term',
        category: 'index_fund',
        suitableFor: 'all',
        allocation: 40,
        pros: ['Extremely low fees', 'Broad diversification', 'Consistent long-term track record'],
        cons: ['Market volatility (can drop 20%+ in a bad year)', 'No ability to "outperform" the market'],
        tags: ['index fund', 'passive investing', 'S&P 500', 'retirement'],
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    },
    {
        title: 'Technology Sector ETF',
        description: 'Focus on the engines of innovation. This strategy allocates more capital to high-growth tech giants and emerging disruptors.',
        content: `## Strategy Overview
The technology sector is the primary driver of global productivity and innovation. This strategy involves taking a larger-than-average position in companies like Apple, Microsoft, NVIDIA, and Google.

## The Thesis
We are in the midst of multiple technological revolutions: AI, Cloud Computing, and Cybersecurity. Companies leading these fields have "moats" and massive profit margins that are difficult for competitors to breach.

## Risks to Consider
Tech stocks are often more sensitive to interest rate changes. When rates rise, their future earnings are worth less today, which can lead to sharp price corrections.

## Implementation
Look for ETFs like **XLK** (Technology Select Sector) or **QQQ** (Nasdaq 100). These provide concentrated exposure to the leaders of the digital age.`,
        riskLevel: 'medium',
        expectedReturn: '12-18% annually',
        expectedReturns: '12-18% annually',
        timeHorizon: '3-7 years',
        investmentHorizon: 'medium_term',
        category: 'etf',
        suitableFor: 'some_experience',
        allocation: 20,
        pros: ['High growth potential', 'Exposure to world-changing innovations', 'Strong historical outperformance'],
        cons: ['Higher volatility', 'Sensitivity to interest rates', 'Sector concentration risk'],
        tags: ['ETF', 'technology', 'growth', 'AI', 'NASDAQ'],
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    },
    {
        title: 'Bitcoin & Ethereum Core Position',
        description: 'A strategic, high-risk allocation to the two dominant digital assets that are redefining global finance.',
        content: `## Strategy Overview
Treating cryptocurrency not as a gamble, but as a "Digital Asset" class. This strategy focuses on Bitcoin (as a store of value) and Ethereum (as a utility platform).

## The Rationale
- **Scarcity**: Bitcoin's fixed supply makes it a potential hedge against currency debasement.
- **Ecosystem**: Ethereum's network effects in DeFi and NFTs make it the "infrastructure" of the future internet (Web3).

## Risk Management
Because of the extreme volatility, this should be a "Satellite" position. Never invest more than you can afford to lose entirely.

## Implementation
You can buy the assets directly on regulated exchanges or through newly approved Spot Bitcoin/Ethereum ETFs if you prefer to stay within a traditional brokerage account.`,
        riskLevel: 'high',
        expectedReturn: 'Variable (20-100%+)',
        expectedReturns: 'Variable (20-100%+)',
        timeHorizon: '3-5+ years',
        investmentHorizon: 'medium_term',
        category: 'crypto',
        suitableFor: 'experienced',
        allocation: 5,
        pros: ['Asymmetric upside potential', 'Portfolio diversification (low correlation to stocks)', 'Institutional adoption'],
        cons: ['Extreme volatility', 'Regulatory risks', 'Potential for total loss'],
        tags: ['crypto', 'bitcoin', 'ethereum', 'speculative'],
        imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    }
];

const dummyKB = [
    {
        intent: 'etf',
        keywords: ['etf', 'exchange traded fund'],
        title: 'Exchange-Traded Funds (ETFs)',
        content: `### 🔗 What is an ETF?
An **Exchange-Traded Fund (ETF)** is a type of investment fund that is traded on stock exchanges, much like individual stocks. It holds assets such as stocks, commodities, or bonds.

**Why Invest in ETFs?**
• **Instant Diversification**: Buying one share gives you exposure to a whole basket of assets.
• **Cost-Effective**: Generally have lower expense ratios than traditional mutual funds.
• **Liquidity**: Can be bought and sold throughout the trading day at market prices.`,
        category: 'Assets'
    },
    {
        intent: 'sip',
        keywords: ['sip', 'systematic investment', 'regular investment'],
        title: 'Systematic Investment Plan (SIP)',
        content: `### 💰 Understanding SIP
A **Systematic Investment Plan (SIP)** is a method of investing a fixed sum of money in a mutual fund scheme at regular intervals (monthly, quarterly, etc.).

**Key Advantages:**
1. **Rupee Cost Averaging**: You buy more units when prices are low and fewer when prices are high.
2. **Disciplined Investing**: It automates your savings and makes investing a habit.
3. **Power of Compounding**: Even small amounts invested regularly can grow significantly over long periods.`,
        category: 'Strategies'
    },
    {
        intent: 'stocks',
        keywords: ['stock', 'share', 'equity', 'market'],
        title: 'Stock Market Investing',
        content: `### 📊 Investing in Stocks
Stocks represent a fractional ownership in a company. When companies grow and earn profits, shareholders benefit through price increases and dividends.

**Tips for Success:**
• **Think Long-Term**: Avoid trying to "time the market" or get rich overnight.
• **Research**: Look at company earnings, debt levels, and management quality.
• **Diversify**: Don't put all your money into a single company or sector.`,
        category: 'Assets'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/investa');
        console.log('✅ Connected to MongoDB for seeding...');

        await Article.deleteMany({});
        await InvestmentIdea.deleteMany({});
        await KnowledgeBase.deleteMany({});
        console.log('🗑️  Existing data cleared.');

        await Article.insertMany(dummyArticles);
        await InvestmentIdea.insertMany(dummyIdeas);
        await KnowledgeBase.insertMany(dummyKB);
        console.log(`✅ Seeded ${dummyArticles.length} articles, ${dummyIdeas.length} ideas, and ${dummyKB.length} KB items.`);

        process.exit();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDB();

seedDB();
