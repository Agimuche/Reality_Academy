const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['assignment', 'enrollment', 'payment', 'resource', 'attendance', 'message', 'grade'],
      default: 'message',
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedId: mongoose.Schema.Types.ObjectId,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
