const mongoose = require('mongoose');
const connectDB = require('../database');

async function run() {
    await mongoose.connect('mongodb://127.0.0.1:27017/investa', { serverSelectionTimeoutMS: 2000 }).catch(async () => {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        return mongoose.connect(mongoServer.getUri());
    });

    const InvestmentIdea = require('../models/InvestmentIdea');
    await InvestmentIdea.deleteMany({});
    
    // Now seed Content Data directly
    const fs = require('fs');
    const path = require('path');
    const ideas = JSON.parse(fs.readFileSync(path.join(__dirname, 'investmentIdeas.json'), 'utf-8'));
    await InvestmentIdea.insertMany(ideas);
    console.log("Deleted old ideas and seeded 190 new ones.");
    process.exit(0);
}
run();
