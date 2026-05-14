const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const InvestmentIdea = require('../models/InvestmentIdea');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/investa', {
            serverSelectionTimeoutMS: 2000
        });
        console.log('✅ MongoDB connected for seeding Investment Ideas');
    } catch (err) {
        console.error('❌ Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

const importData = async () => {
    await connectDB();
    try {
        const filePath = path.join(__dirname, 'investmentIdeas.json');
        if (!fs.existsSync(filePath)) {
            console.error('❌ investmentIdeas.json not found in seed directory');
            process.exit(1);
        }
        
        const ideas = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        // Prevent duplicate insertion by clearing old data
        await InvestmentIdea.deleteMany(); 
        console.log('🧹 Cleared existing investment ideas...');
        
        await InvestmentIdea.insertMany(ideas);
        console.log(`✅ Seeded ${ideas.length} Investment Ideas successfully`);
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding Investment Ideas:', error);
        process.exit(1);
    }
};

importData();
