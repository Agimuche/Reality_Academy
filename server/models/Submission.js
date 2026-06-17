const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: String,
    answers: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    score: {
      type: Number,
      default: null,
    },
    feedback: String,
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    gradedAt: Date,
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', SubmissionSchema);
