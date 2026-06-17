const express = require('express');
const messageController = require('../controllers/messageController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, messageController.sendMessage);
router.get('/contacts', authMiddleware, messageController.getContacts);
router.get('/:userId', authMiddleware, messageController.getMessages);

module.exports = router;
