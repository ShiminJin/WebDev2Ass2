const express = require('express');
const router = express.Router();
const db = require('../event_db');

// GET /api/events - Get the list of activities on the homepage
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                e.*,
                c.name as category_name,
                c.description as category_description,
                o.name as organization_name,
                o.description as organization_description,
                o.contact_email,
                o.contact_phone,
                o.logo_url as organization_logo
            FROM events e
            JOIN categories c ON e.category_id = c.id
            JOIN organizations o ON e.organization_id = o.id
            WHERE e.is_active = TRUE 
            AND e.is_suspended = FALSE
            AND e.event_date >= CURDATE()
            ORDER BY e.event_date ASC
        `;

        const [events] = await db.execute(query);
        
        res.json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch events',
            message: error.message
        });
    }
// GET /api/events/search - Search for events
router.get('/search', async (req, res) => {
    try {
        const { category, location, date } = req.query;
        
        let baseQuery = `
            SELECT 
                e.*,
                c.name as category_name,
                o.name as organization_name,
                o.logo_url as organization_logo
            FROM events e
            JOIN categories c ON e.category_id = c.id
            JOIN organizations o ON e.organization_id = o.id
            WHERE e.is_active = TRUE 
            AND e.is_suspended = FALSE
            AND e.event_date >= CURDATE()
        `;

        const params = [];
        
        // Build dynamic query conditions
        if (category) {
            baseQuery += ' AND e.category_id = ?';
            params.push(category);
        }
        
        if (location) {
            baseQuery += ' AND e.location LIKE ?';
            params.push(`%${location}%`);
        }
        
        if (date) {
            baseQuery += ' AND DATE(e.event_date) = ?';
            params.push(date);
        }

        baseQuery += ' ORDER BY e.event_date ASC';

        const [events] = await db.execute(baseQuery, params);
        
        res.json({
            success: true,
            count: events.length,
            filters: { category, location, date },
            data: events
        });
    } catch (error) {
        console.error('Error searching events:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search events',
            message: error.message
        });
    }
});

// GET /api/events/:id - Get event details
router.get('/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        
        const query = `
            SELECT 
                e.*,
                c.name as category_name,
                c.description as category_description,
                o.name as organization_name,
                o.description as organization_description,
                o.contact_email,
                o.contact_phone,
                o.address as organization_address,
                o.website_url as organization_website,
                o.logo_url as organization_logo
            FROM events e
            JOIN categories c ON e.category_id = c.id
            JOIN organizations o ON e.organization_id = o.id
            WHERE e.id = ? AND e.is_active = TRUE AND e.is_suspended = FALSE
        `;

        const [events] = await db.execute(query, [eventId]);
        
        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Event not found',
                message: `Event with ID ${eventId} does not exist or is not active`
            });
        }

        res.json({
            success: true,
            data: events[0]
        });
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch event details',
            message: error.message
        });
    }
});

// GET /api/events/organization/:orgId - Get events by organization
router.get('/organization/:orgId', async (req, res) => {
    try {
        const orgId = req.params.orgId;
        
        const query = `
            SELECT 
                e.*,
                c.name as category_name
            FROM events e
            JOIN categories c ON e.category_id = c.id
            WHERE e.organization_id = ? 
            AND e.is_active = TRUE 
            AND e.is_suspended = FALSE
            AND e.event_date >= CURDATE()
            ORDER BY e.event_date ASC
        `;

        const [events] = await db.execute(query, [orgId]);
        
        res.json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        console.error('Error fetching organization events:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch organization events',
            message: error.message
        });
    }
});

module.exports = router;