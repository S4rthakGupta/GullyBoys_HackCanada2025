// const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// // Add Clerk secret key to .env
// require('dotenv').config();

// const requireAuth = ClerkExpressRequireAuth({
//     // Clerk will verify the session
//     onError: (err, req, res) => {
//         console.error('Auth Error:', err);
//         res.status(401).json({ error: 'Unauthorized' });
//     }
// });

// module.exports = requireAuth;


module.exports = (req, res, next) => {
    next()
}