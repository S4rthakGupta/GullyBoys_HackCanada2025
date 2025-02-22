const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const db = require('../config/database');
const redisClient = require('../config/redis');

// Generate new token
router.post('/generate', requireAuth, async (req, res) => {
    try {
        const userId = req.auth.userId;
        
        // Get current token count from Redis
        let currentToken = await redisClient.get('current_token_count') || 0;
        currentToken = parseInt(currentToken) + 1;

        // Save token to Redis
        await redisClient.set(`user_token:${userId}`, currentToken);
        await redisClient.set('current_token_count', currentToken);

        // Update SQLite
        const query = 'UPDATE users SET current_token = ? WHERE clerk_user_id = ?';
        db.run(query, [currentToken, userId]);

        res.json({ token: currentToken });
    } catch (error) {
        console.error('Error generating token:', error);
        res.status(500).json({ error: 'Failed to generate token' });
    }
});

// Get current token
router.get('/current', async (req, res) => {
    try {
        const currentToken = await redisClient.get('current_serving') || 0;
        res.json({ currentToken: parseInt(currentToken) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get current token' });
    }
});

// Get user's token
router.get('/my-token', requireAuth, async (req, res) => {
    try {
        const userId = req.auth.userId;
        const token = await redisClient.get(`user_token:${userId}`);
        res.json({ token: token ? parseInt(token) : null });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get token' });
    }
});

module.exports = router;