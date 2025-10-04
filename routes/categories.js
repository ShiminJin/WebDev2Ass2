const express = require('express');
const router = express.Router();
const db = require('../event_db');

// GET /api/categories - Get the list of categories
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT * FROM categories 
            ORDER BY name ASC
        `;

        const [categories] = await db.execute(query);
        
        res.json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch categories',
            message: error.message
        });
    }
});

// GET /api/categories/:id/events - Get events by category ID
router.get('/:id/events', async (req, res) => {
    try {
        const categoryId = req.params.id;
        
        const query = `
            SELECT 
                e.*,
                c.name as category_name,
                o.name as organization_name,
                o.logo_url as organization_logo
            FROM events e
            JOIN categories c ON e.category_id = c.id
            JOIN organizations o ON e.organization_id = o.id
            WHERE e.category_id = ? 
            AND e.is_active = TRUE 
            AND e.is_suspended = FALSE
            AND e.event_date >= CURDATE()
            ORDER BY e.event_date ASC
        `;

        const [events] = await db.execute(query, [categoryId]);
        
        res.json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        console.error('Error fetching category events:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch category events',
            message: error.message
        });
    }
});

module.exports = router;