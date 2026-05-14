const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Video = require('../models/Video');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/investa', {
            serverSelectionTimeoutMS: 2000
        });
        console.log('✅ MongoDB connected for seeding Videos');
    } catch (err) {
        console.error('❌ Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

const importData = async () => {
    await connectDB();
    try {
        const filePath = path.join(__dirname, 'videos.json');
        if (!fs.existsSync(filePath)) {
            console.error('❌ videos.json not found in seed directory');
            process.exit(1);
        }
        
        const videos = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        // Prevent duplicate insertion by clearing old data
        await Video.deleteMany(); 
        console.log('🧹 Cleared existing videos...');
        
        await Video.insertMany(videos);
        console.log(`✅ Seeded ${videos.length} Videos successfully`);
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding Videos:', error);
        process.exit(1);
    }
};

importData();
