const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Rate limiter for auth routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many authentication attempts, please try again later',
});

// Public routes
router.post('/register', limiter, authController.register);
router.post('/login', limiter, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Protected routes
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
