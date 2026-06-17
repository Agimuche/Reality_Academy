const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
    },
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
    // file type/category (free-form to allow any format)
    type: {
      type: String,
      default: 'file',
    },
    // original mime type and filename
    mimeType: String,
    originalName: String,
    url: {
      type: String,
      required: true,
    },
    size: String,
    publicId: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', ResourceSchema);
