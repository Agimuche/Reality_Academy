const express = require('express');
const paymentController = require('../controllers/paymentController');
const { authMiddleware, roleGuard } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.post('/initialize', authMiddleware, roleGuard(['student']), paymentController.initializePayment);
router.post('/webhook', paymentController.handleWebhook); // No auth for webhook
router.get('/verify/:reference', authMiddleware, paymentController.verifyPayment);
router.get('/my', authMiddleware, roleGuard(['student']), paymentController.getMyPayments);
router.get('/all', authMiddleware, roleGuard(['admin']), paymentController.getAllPayments);
router.post('/payout', authMiddleware, roleGuard(['admin']), paymentController.processPayout);

module.exports = router;
