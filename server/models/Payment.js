const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    amount: {
      type: Number,
      required: true,
    },
    method: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    ref: {
      type: String,
      unique: true,
      required: true,
    },
    paystackRef: String,
    type: {
      type: String,
      enum: ['enrollment', 'instructor_payout'],
      default: 'enrollment',
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);
