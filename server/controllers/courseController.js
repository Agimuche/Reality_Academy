const Course = require('../models/Course');
const User = require('../models/User');

// @route   GET /api/v1/courses
// @desc    Get all published courses
// @access  Public
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'published' })
      .populate('instructorId', 'name bio')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/v1/courses/:id
// @desc    Get single course
// @access  Public
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructorId', 'name bio email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   POST /api/v1/courses
// @desc    Create new course
// @access  Private (instructor/admin)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, price, duration, modules, lessons, syllabus } = req.body;

    // Validation
    if (!title || !description || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const instructor = await User.findById(req.user.id);

    const course = await Course.create({
      title,
      description,
      category,
      price,
      duration,
      modules,
      lessons,
      syllabus,
      instructorId: req.user.id,
      instructor: instructor.name,
      status: 'draft',
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/v1/courses/:id
// @desc    Update course
// @access  Private (instructor/admin)
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check ownership
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course',
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   DELETE /api/v1/courses/:id
// @desc    Delete course
// @access  Private (instructor/admin)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check ownership
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course',
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/v1/courses/instructor/my
// @desc    Get instructor's own courses
// @access  Private (instructor)
exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructorId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/v1/courses/:id/students
// @desc    Get enrolled students for a course
// @access  Private (instructor/admin)
exports.getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check authorization
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const students = await User.find(
      { enrolled: req.params.id },
      'name email phone progress'
    );

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
