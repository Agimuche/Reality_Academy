const express = require('express');
const certificateController = require('../controllers/certificateController');
const { authMiddleware, roleGuard } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:courseId', authMiddleware, roleGuard(['student']), certificateController.generateCertificate);

module.exports = router;
