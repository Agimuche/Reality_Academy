const Resource = require('../models/Resource');
const { deleteFromCloudinary } = require('../middleware/uploadMiddleware');

// @route   POST /api/v1/resources
// @desc    Upload resource
// @access  Private (instructor)
exports.uploadResource = async (req, res) => {
  try {
    const { title, courseId, type } = req.body;

    if (!title || !courseId || !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Title, courseId, and file are required',
      });
    }

    const resource = await Resource.create({
      title,
      courseId,
      instructorId: req.user.id,
      // allow any type; store mime info and original filename
      type: type || req.file.mimetype || 'file',
      mimeType: req.file.mimetype,
      originalName: req.file.originalname,
      url: req.file.path,
      size: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
      publicId: req.file.filename,
    });

    res.status(201).json({
      success: true,
      message: 'Resource uploaded successfully',
      data: resource,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/v1/resources
// @desc    Get resources for a course
// @access  Private
exports.getResources = async (req, res) => {
  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'courseId is required',
      });
    }

    const resources = await Resource.find({ courseId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   DELETE /api/v1/resources/:id
// @desc    Delete resource
// @access  Private (instructor)
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    if (resource.instructorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Delete from Cloudinary
    if (resource.publicId) {
      await deleteFromCloudinary(resource.publicId);
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Resource deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
