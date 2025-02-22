const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const db = require('../config/database');

// Create/Update user profile
router.post('/profile', requireAuth, (req, res) => {
    const { name, phone, email } = req.body;
    const clerkUserId = req.auth.userId;

    db.run(`
        INSERT INTO users (clerk_user_id, name, phone, email) 
        VALUES (?, ?, ?, ?)
        ON CONFLICT(clerk_user_id) 
        DO UPDATE SET name=?, phone=?, email=?
    `, [clerkUserId, name, phone, email, name, phone, email], (err) => {
        if (err) {
            console.error('Error saving user:', err);
            return res.status(500).json({ error: 'Failed to save user profile' });
        }
        res.json({ message: 'Profile updated successfully' });
    });
});

// Get user profile
router.get('/profile', requireAuth, (req, res) => {
    const clerkUserId = req.auth.userId;

    db.get('SELECT * FROM users WHERE clerk_user_id = ?', [clerkUserId], (err, user) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Failed to fetch profile' });
        }
        res.json(user || {});
    });
});

module.exports = router;