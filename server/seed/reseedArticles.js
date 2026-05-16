const mongoose = require('mongoose');
const connectDB = require('../database');

async function run() {
    await mongoose.connect('mongodb://127.0.0.1:27017/investa', { serverSelectionTimeoutMS: 2000 }).catch(async () => {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        return mongoose.connect(mongoServer.getUri());
    });

    const Article = require('../models/Article');
    await Article.deleteMany({});
    
    const fs = require('fs');
    const path = require('path');
    const articles = JSON.parse(fs.readFileSync(path.join(__dirname, 'articles.json'), 'utf-8'));
    
    await Article.insertMany(articles);
    console.log("Deleted old articles and seeded 200 new ones.");
    process.exit(0);
}
run();
