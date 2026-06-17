const express = require('express');
const resourceController = require('../controllers/resourceController');
const { authMiddleware, roleGuard } = require('../middleware/authMiddleware');
const { uploadResource } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleGuard(['instructor', 'admin']), uploadResource.single('file'), resourceController.uploadResource);
router.get('/', authMiddleware, resourceController.getResources);
router.delete('/:id', authMiddleware, roleGuard(['instructor', 'admin']), resourceController.deleteResource);

module.exports = router;
