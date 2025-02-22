const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcrypt');

// Admin & Patient Login
router.post('/login', (req, res) => {
    const { email, password, clerkUserId } = req.body;

    // If admin is logging in with email & password
    if (email && password) {
        db.get('SELECT * FROM users WHERE email = ? AND role = "admin"', [email], async (err, user) => {
            if (err || !user) {
                return res.json({ authenticated: false, error: "Invalid credentials" });
            }

            // Compare hashed password
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.json({ authenticated: false, error: "Invalid credentials" });
            }

            res.json({ authenticated: true, role: "admin" });
        });
    } 
    // If patient is logging in via Clerk (clerkUserId)
    else if (clerkUserId) {
        db.get('SELECT * FROM users WHERE clerk_user_id = ? AND role = "patient"', [clerkUserId], (err, user) => {
            if (err || !user) {
                return res.json({ authenticated: false, error: "Invalid patient" });
            }
            res.json({ authenticated: true, role: "patient" });
        });
    } 
    else {
        res.status(400).json({ error: "Invalid login request" });
    }
});

module.exports = router;
