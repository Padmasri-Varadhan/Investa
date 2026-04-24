const mongoose = require('mongoose');

/**
 * Connect to MongoDB (non-fatal - server continues without DB)
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/investa',
            { serverSelectionTimeoutMS: 5000 }
        );
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return true;
    } catch (error) {
        console.warn(`⚠️  MongoDB not connected: ${error.message}`);
        console.warn('   Running in offline mode with in-memory data.');
        return false;
    }
};

module.exports = connectDB;
