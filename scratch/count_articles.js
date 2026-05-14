const mongoose = require('mongoose');
const Article = require('../server/models/Article');
require('dotenv').config({ path: '../server/.env' });

async function countArticles() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const count = await Article.countDocuments();
        console.log(`Total articles in database: ${count}`);
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

countArticles();
