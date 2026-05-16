const mongoose = require('mongoose');

async function run() {
    await mongoose.connect('mongodb://127.0.0.1:27017/investa', { serverSelectionTimeoutMS: 2000 }).catch(async () => {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        return mongoose.connect(mongoServer.getUri());
    });

    const Video = require('../models/Video');
    await Video.deleteMany({});
    
    const fs = require('fs');
    const path = require('path');
    const videos = JSON.parse(fs.readFileSync(path.join(__dirname, 'videos.json'), 'utf-8'));
    
    await Video.insertMany(videos);
    console.log("Deleted old videos and seeded 200 new ones.");
    process.exit(0);
}
run();
