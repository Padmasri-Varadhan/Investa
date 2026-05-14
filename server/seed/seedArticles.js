const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Article = require('../models/Article');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/investa', {
            serverSelectionTimeoutMS: 2000
        });
        console.log('✅ MongoDB connected for seeding Articles');
    } catch (err) {
        console.error('❌ Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

const importData = async () => {
    await connectDB();
    try {
        const filePath = path.join(__dirname, 'articles.json');
        if (!fs.existsSync(filePath)) {
            console.error('❌ articles.json not found in seed directory');
            process.exit(1);
        }
        
        const articles = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        // Prevent duplicate insertion by clearing old data
        await Article.deleteMany(); 
        console.log('🧹 Cleared existing articles...');
        
        await Article.insertMany(articles);
        console.log(`✅ Seeded ${articles.length} Articles successfully`);
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding Articles:', error);
        process.exit(1);
    }
};

importData();
