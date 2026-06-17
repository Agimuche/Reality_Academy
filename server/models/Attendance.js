const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topic: String,
    records: {
      type: Map,
      of: {
        type: String,
        enum: ['present', 'absent', 'late'],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance', AttendanceSchema);
