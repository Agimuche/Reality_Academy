const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const User = require('../models/User');
const Course = require('../models/Course');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');

// @route   GET /api/v1/assignments
// @desc    Get assignments for the current user or a specific course
// @access  Private
exports.getAssignments = async (req, res) => {
  try {
    const { courseId } = req.query;
    let filter = {};

    if (courseId) {
      filter.courseId = courseId;
    } else if (req.user.role === 'student') {
      const student = await User.findById(req.user.id);
      filter.courseId = { $in: student.enrolled || [] };
    } else if (req.user.role === 'instructor') {
      filter.instructorId = req.user.id;
    }

    const assignments = await Assignment.find(filter)
      .populate('submissions')
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   POST /api/v1/assignments
// @desc    Create assignment
// @access  Private (instructor)
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, courseId, type, dueDate, totalScore, questions } = req.body;

    if (!title || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Title and courseId are required',
      });
    }

    const assignment = await Assignment.create({
      title,
      description,
      courseId,
      instructorId: req.user.id,
      type,
      dueDate,
      totalScore,
      questions,
    });

    res.status(201).json({
      success: true,
      message: 'Assignment created',
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/v1/assignments/:id
// @desc    Update assignment
// @access  Private (instructor)
exports.updateAssignment = async (req, res) => {
  try {
    let assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    if (assignment.instructorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Assignment updated',
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   DELETE /api/v1/assignments/:id
// @desc    Delete assignment
// @access  Private (instructor)
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    if (assignment.instructorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    await Assignment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Assignment deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   POST /api/v1/submissions
// @desc    Submit assignment
// @access  Private (student)
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, text, answers } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    // Check if already submitted
    const existing = await Submission.findOne({
      assignmentId,
      studentId: req.user.id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted this assignment',
      });
    }

    // If quiz, auto-calculate score
    let score = null;
    if (assignment.type === 'quiz' && answers) {
      let correctCount = 0;
      for (const question of assignment.questions) {
        if (answers[question.id] === question.correct) {
          correctCount++;
        }
      }
      score = Math.round((correctCount / assignment.questions.length) * assignment.totalScore);
    }

    const submission = await Submission.create({
      assignmentId,
      studentId: req.user.id,
      text,
      answers,
      score,
    });

    // Create notification for instructor
    const student = await User.findById(req.user.id);
    const instructor = await User.findById(assignment.instructorId);

    await Notification.create({
      userId: assignment.instructorId,
      text: `${student.name} submitted "${assignment.title}"`,
      type: 'assignment',
      relatedId: assignment._id,
    });

    // Send email to instructor
    try {
      await sendEmail(
        instructor.email,
        'assignmentSubmitted',
        instructor.name,
        student.name,
        assignment.title
      );
    } catch (emailError) {
      console.warn('Submission email failed:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully',
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/v1/submissions
// @desc    Get submissions for assignment
// @access  Private (instructor)
exports.getSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.query;

    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        message: 'assignmentId is required',
      });
    }

    const submissions = await Submission.find({ assignmentId })
      .populate('studentId', 'name email')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/v1/submissions/my
// @desc    Get student's submissions
// @access  Private (student)
exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ studentId: req.user.id })
      .populate('assignmentId', 'title')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/v1/submissions/:id/grade
// @desc    Grade submission
// @access  Private (instructor)
exports.gradeSubmission = async (req, res) => {
  try {
    const { score, feedback } = req.body;

    let submission = await Submission.findById(req.params.id)
      .populate('assignmentId')
      .populate('studentId');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    if (submission.assignmentId.instructorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    submission.score = score;
    submission.feedback = feedback;
    submission.gradedAt = Date.now();
    submission.gradedBy = req.user.id;
    await submission.save();

    // Create notification for student
    await Notification.create({
      userId: submission.studentId._id,
      text: `Your submission for "${submission.assignmentId.title}" has been graded: ${score}/${submission.assignmentId.totalScore}`,
      type: 'grade',
      relatedId: submission.assignmentId._id,
    });

    // Send email to student
    try {
      await sendEmail(
        submission.studentId.email,
        'assignmentGraded',
        submission.studentId.name,
        submission.assignmentId.title,
        score,
        feedback
      );
    } catch (emailError) {
      console.warn('Grade email failed:', emailError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Submission graded',
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
