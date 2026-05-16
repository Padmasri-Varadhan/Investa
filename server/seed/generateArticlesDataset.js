const fs = require('fs');
const path = require('path');

const categories = [
    'Stock Market Basics', 'Mutual Funds', 'SIP Investments', 'Real Estate',
    'Cryptocurrency', 'Gold Investment', 'Personal Finance', 'Budgeting',
    'Retirement Planning', 'Tax Saving', 'Wealth Building', 'Trading Basics',
    'Fundamental Analysis', 'Technical Analysis', 'Risk Management', 'Passive Income',
    'ETFs and Index Funds', 'Bonds and Government Securities', 'International Investing',
    'Financial Planning'
];

const generateSubTopics = (category) => {
    return [
        `Introduction to ${category}: A Beginner's Guide`,
        `Top 5 Strategies for Success in ${category}`,
        `Common Mistakes to Avoid in ${category}`,
        `How to Evaluate Opportunities in ${category}`,
        `The Future of ${category} in 2026 and Beyond`,
        `Advanced Tactics for ${category} Professionals`,
        `Step-by-Step Tutorial: Mastering ${category}`,
        `Risk vs Reward: Analyzing ${category}`,
        `Building a Diversified Portfolio with ${category}`,
        `Tax Implications and Benefits of ${category}`
    ];
};

const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
const authors = ['Investa Expert Team', 'Rahul Sharma', 'Priya Desai', 'Arjun Patel'];

const generateContent = (title, category) => {
    return `
# ${title}

Welcome to this comprehensive guide on **${category}**. Whether you are just starting out or looking to refine your strategies, understanding the core concepts of this financial domain is crucial for long-term wealth building.

## 1. What You Need to Know
${category} has evolved significantly over the years. To succeed, investors must stay informed about market trends, regulatory changes, and fundamental economic indicators.

### Key Concepts:
*   **Market Dynamics:** Understanding how supply and demand influence prices.
*   **Risk Tolerance:** Assessing how much volatility you can withstand.
*   **Time Horizon:** Aligning your investment goals with your timeline.

## 2. Practical Examples and Strategies
Let's look at a practical scenario. If an investor allocates 15% of their portfolio to ${category}, they must balance this with safer assets like bonds or fixed deposits to maintain a healthy risk profile.

> **Pro Tip:** Always do your own research (DYOR) and never invest money you cannot afford to lose. The golden rule of ${category} is consistency and patience.

## 3. Common Pitfalls to Avoid
Many beginners jump into ${category} without a clear plan. Avoid these mistakes:
*   Following the herd or "FOMO" investing.
*   Ignoring transaction costs and taxes.
*   Failing to diversify across different asset classes.

## 4. Conclusion
In summary, ${category} offers substantial opportunities for growth when approached with discipline and a well-researched strategy. Keep learning, stay patient, and focus on your long-term financial goals.
`;
};

const articles = [];

categories.forEach(cat => {
    const topics = generateSubTopics(cat);
    topics.forEach((title, index) => {
        const difficulty = index < 3 ? 'Beginner' : index < 7 ? 'Intermediate' : 'Advanced';
        const riskLevel = difficulty === 'Beginner' ? 'low' : difficulty === 'Intermediate' ? 'medium' : 'high';
        
        articles.push({
            title: title,
            category: cat,
            riskLevel: riskLevel,
            difficultyLevel: difficulty,
            summary: `Learn everything you need to know about ${title}. This comprehensive guide breaks down the core concepts, strategies, and risks associated with ${cat}.`,
            fullContent: generateContent(title, cat),
            readTime: Math.floor(Math.random() * 8) + 4, // 4 to 11 mins
            author: authors[Math.floor(Math.random() * authors.length)],
            tags: [cat.toLowerCase().replace(/ /g, '_'), difficulty.toLowerCase(), 'finance', 'investing']
        });
    });
});

fs.writeFileSync(path.join(__dirname, 'articles.json'), JSON.stringify(articles, null, 2));
console.log(`Successfully generated ${articles.length} articles!`);
