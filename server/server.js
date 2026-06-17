require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');

// Initialize Express app
const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3001',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
].filter(Boolean);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Connect to MongoDB
connectDB();

// Health check route
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/courses', require('./routes/courseRoutes'));
app.use('/api/v1/payments', require('./routes/paymentRoutes'));
app.use('/api/v1/assignments', require('./routes/assignmentRoutes'));
app.use('/api/v1/resources', require('./routes/resourceRoutes'));
app.use('/api/v1/attendance', require('./routes/attendanceRoutes'));
app.use('/api/v1/messages', require('./routes/messageRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/certificates', require('./routes/certificateRoutes'));

// Socket.io event handling
require('./socket')(io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 Reality Academy API Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}\n`);
});

module.exports = { app, server, io };
