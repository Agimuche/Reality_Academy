const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Course = require('../models/Course');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');

// @route   POST /api/v1/attendance
// @desc    Save attendance
// @access  Private (instructor)
exports.saveAttendance = async (req, res) => {
  try {
    const { courseId, date, topic, records } = req.body;

    if (!courseId || !date || !records) {
      return res.status(400).json({
        success: false,
        message: 'courseId, date, and records are required',
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if attendance for this date exists
    let attendance = await Attendance.findOne({ courseId, date });

    if (attendance) {
      attendance = await Attendance.findByIdAndUpdate(
        attendance._id,
        { records, topic },
        { new: true }
      );
    } else {
      attendance = await Attendance.create({
        courseId,
        date,
        topic,
        instructorId: req.user.id,
        records,
      });
    }

    // Send notifications to absent students
    for (const [studentId, status] of Object.entries(records)) {
      if (status === 'absent') {
        const student = await User.findById(studentId);
        if (student) {
          await Notification.create({
            userId: studentId,
            text: `You were marked absent from ${course.title} on ${date}`,
            type: 'attendance',
          });

          try {
            await sendEmail(student.email, 'attendanceAbsent', student.name, course.title, date);
          } catch (emailError) {
            console.warn('Attendance email failed:', emailError.message);
          }
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Attendance saved',
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/v1/attendance
// @desc    Get attendance history
// @access  Private (instructor)
exports.getAttendance = async (req, res) => {
  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'courseId is required',
      });
    }

    const attendance = await Attendance.find({ courseId })
      .populate('instructorId', 'name')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
