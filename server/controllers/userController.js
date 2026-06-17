const User = require('../models/User');
const Notification = require('../models/Notification');

// @route   PUT /api/v1/users/avatar
// @desc    Upload avatar image
// @access  Private
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Avatar file is required',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.path },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /api/v1/users/profile
// @desc    Update user profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address, bio },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/v1/users/all
// @desc    Get all users (admin)
// @access  Private
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
