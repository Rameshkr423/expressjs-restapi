require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./database/config'); // Import the DB connection file
const tearoutes = require('./routes/user'); // Import routes
const helmet = require('helmet');
const compression = require('compression');

const app = express();

// Security & Performance Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Serve static files (including index.html)
app.use(express.static(path.join(__dirname, 'views'))); // Ensure index.html is in "public"

// Custom middleware
app.use((req, res, next) => {
    console.log('Middleware executed!');
    next(); // Pass control to the next middleware or route
});

// Use API routes
app.use('/api', tearoutes); // Use API routes under "/api"

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Your app is listening on port ${PORT}`);
});
