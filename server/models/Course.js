const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    duration: String,
    modules: {
      type: Number,
      default: 0,
    },
    lessons: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    instructor: String,
    cover: {
      type: String,
      default: '#4169E1',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    syllabus: [String],
    enrolled: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', CourseSchema);
