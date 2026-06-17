const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const { authMiddleware, roleGuard } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleGuard(['instructor', 'admin']), attendanceController.saveAttendance);
router.get('/', authMiddleware, roleGuard(['instructor', 'admin']), attendanceController.getAttendance);

module.exports = router;
