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
        `What is ${category}?`,
        `How to Get Started with ${category}`,
        `Top Strategies for ${category}`,
        `Common Mistakes in ${category}`,
        `Advanced ${category} Masterclass`,
        `The Future of ${category}`,
        `Step-by-Step ${category} Tutorial`,
        `Analyzing Risk in ${category}`,
        `Building Wealth with ${category}`,
        `Tax Implications of ${category}`
    ];
};

const advisors = ['Investa Academy', 'Rahul Sharma', 'Priya Desai', 'Arjun Patel', 'Global Finance'];
const videoIds = ['EngW7tCbLh0', 'dQw4w9WgXcQ', 'tgbNymZ7vqY', 'kJQP7kiw5Fk', 'e-ORhEE9VVg']; // Sample valid youtube IDs

const videos = [];

categories.forEach(cat => {
    const topics = generateSubTopics(cat);
    topics.forEach((title, index) => {
        const level = index < 3 ? 'Beginner' : index < 7 ? 'Intermediate' : 'Advanced';
        const mins = Math.floor(Math.random() * 15) + 5;
        const secs = Math.floor(Math.random() * 60);
        
        videos.push({
            title: title,
            category: cat,
            level: level,
            videoUrl: `https://www.youtube.com/embed/${videoIds[Math.floor(Math.random() * videoIds.length)]}`,
            thumbnail: `https://img.youtube.com/vi/${videoIds[Math.floor(Math.random() * videoIds.length)]}/maxresdefault.jpg`,
            description: `In this video, we cover the essentials of ${title}. You will learn the foundational concepts of ${cat} and how to apply them effectively to your portfolio.`,
            duration: `${mins}:${secs < 10 ? '0' + secs : secs}`,
            advisor: advisors[Math.floor(Math.random() * advisors.length)],
            views: `${Math.floor(Math.random() * 90) + 10}K`,
            tags: [cat.toLowerCase().replace(/ /g, '_'), level.toLowerCase(), 'finance', 'investing']
        });
    });
});

fs.writeFileSync(path.join(__dirname, 'videos.json'), JSON.stringify(videos, null, 2));
console.log(`Successfully generated ${videos.length} videos!`);
