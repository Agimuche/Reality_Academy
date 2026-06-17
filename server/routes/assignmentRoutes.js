const express = require('express');
const assignmentController = require('../controllers/assignmentController');
const { authMiddleware, roleGuard } = require('../middleware/authMiddleware');

const router = express.Router();

// Get assignments (both protected to check enrollment)
router.get('/', authMiddleware, assignmentController.getAssignments);

// Instructor routes
router.post('/', authMiddleware, roleGuard(['instructor', 'admin']), assignmentController.createAssignment);
router.put('/:id', authMiddleware, roleGuard(['instructor', 'admin']), assignmentController.updateAssignment);
router.delete('/:id', authMiddleware, roleGuard(['instructor', 'admin']), assignmentController.deleteAssignment);
router.get('/instructor/submissions', authMiddleware, roleGuard(['instructor', 'admin']), assignmentController.getSubmissions);

// Student routes
router.post('/submit', authMiddleware, roleGuard(['student']), assignmentController.submitAssignment);
router.get('/my/submissions', authMiddleware, roleGuard(['student']), assignmentController.getMySubmissions);

// Grading route
router.put('/submissions/:id/grade', authMiddleware, roleGuard(['instructor', 'admin']), assignmentController.gradeSubmission);

module.exports = router;
