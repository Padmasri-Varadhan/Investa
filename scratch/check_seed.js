const mongoose = require('mongoose');
const Article = require('./server/models/Article');
const InvestmentIdea = require('./server/models/InvestmentIdea');
const dotenv = require('dotenv');

dotenv.config({ path: './server/.env' });

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/investa', { serverSelectionTimeoutMS: 2000 });
        console.log('Connected to MongoDB');
        
        const articleCount = await Article.countDocuments();
        console.log('Total Articles:', articleCount);
        
        const firstArticle = await Article.findOne({ title: 'Getting Started with Stock Market Investing' });
        if (firstArticle) {
            console.log('First Article found with rich content!');
            console.log('Content length:', firstArticle.content.length);
        } else {
            console.log('Rich article NOT found. Seeding might have failed or using memory server.');
        }
        
        process.exit();
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
}

check();
