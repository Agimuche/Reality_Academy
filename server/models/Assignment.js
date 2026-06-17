const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
    },
    description: String,
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'quiz', 'project', 'assignment'],
      default: 'assignment',
    },
    dueDate: Date,
    totalScore: {
      type: Number,
      default: 100,
    },
    questions: [
      {
        id: String,
        text: String,
        options: [String],
        correct: Number,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

AssignmentSchema.virtual('submissions', {
  ref: 'Submission',
  localField: '_id',
  foreignField: 'assignmentId',
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
