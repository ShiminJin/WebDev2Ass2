const express = require('express');
const cors = require('cors');
const path = require('path');

// Import route
const eventRoutes = require('./routes/events');
const categoryRoutes = require('./routes/categories');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../client')));

// API routes
app.use('/api/events', eventRoutes);
app.use('/api/categories', categoryRoutes);

// Root path
app.get('/', (req, res) => {
    res.json({
        message: 'Charity Events API is running!',
        endpoints: {
            events: '/api/events',
            categories: '/api/categories',
            search: '/api/events/search?location=Sydney&category=1'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: 'charityevents_db'
    });
});

// 404 processing
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `The requested endpoint ${req.originalUrl} does not exist`,
        availableEndpoints: ['/api/events', '/api/categories', '/api/events/search']
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('API Error:', error);
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong on the server'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(` Charity Events API server running on port ${PORT}(｀・ω・´)`);
    console.log(` Base URL: http://localhost:${PORT}/(｀・ω・´)`);
    console.log(` API Documentation:`);
    console.log(`   - All events: http://localhost:${PORT}/api/events`);
    console.log(`   - All categories: http://localhost:${PORT}/api/categories`);
    console.log(`   - Search events: http://localhost:${PORT}/api/events/search?location=Sydney`);
    console.log(`(｀・ω・´)`);
});