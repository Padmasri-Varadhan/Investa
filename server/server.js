const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./database');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware — allow configurable CORS origin for production deployments
const corsOptions = {
    origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
        : true, // Allow all origins in development
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));

// Routes
app.use('/api', require('./routes/userRoutes'));
app.use('/api/articles', require('./routes/articleRoutes'));
app.use('/api/investment-ideas', require('./routes/investmentRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));

// Health check route
app.get('/', (req, res) => {
    res.json({ message: '🚀 Investa API is running!', status: 'OK' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Investa server running on http://localhost:${PORT}`);
    // Trigger nodemon restart
});

module.exports = app;
