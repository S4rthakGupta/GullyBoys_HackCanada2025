const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

// Import routes
const tokenRoutes = require('./routes/tokenRoutes');
const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
const authRoutes = require('./routes/authRoutes');

// Import database connections
const db = require('./config/database');
const redisClient = require('./config/redis');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/token', tokenRoutes);
app.use('/api/user', userRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api', authRoutes);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Export io instance for use in other files
module.exports = { io };