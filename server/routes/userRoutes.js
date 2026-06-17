const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware, roleGuard } = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.put('/avatar', authMiddleware, uploadAvatar.single('avatar'), userController.uploadAvatar);
router.put('/profile', authMiddleware, userController.updateProfile);
router.get('/all', authMiddleware, roleGuard(['admin']), userController.getAllUsers);

module.exports = router;
