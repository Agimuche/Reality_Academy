const express = require('express');
const courseController = require('../controllers/courseController');
const { authMiddleware, roleGuard } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/instructor/my', authMiddleware, roleGuard(['instructor']), courseController.getInstructorCourses);
router.get('/:id/students', authMiddleware, roleGuard(['instructor', 'admin']), courseController.getCourseStudents);
router.get('/:id', courseController.getCourse);

// Protected routes
router.post('/', authMiddleware, roleGuard(['instructor', 'admin']), courseController.createCourse);
router.put('/:id', authMiddleware, roleGuard(['instructor', 'admin']), courseController.updateCourse);
router.delete('/:id', authMiddleware, roleGuard(['instructor', 'admin']), courseController.deleteCourse);

module.exports = router;
