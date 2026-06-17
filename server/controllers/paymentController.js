const Payment = require('../models/Payment');
const User = require('../models/User');
const Course = require('../models/Course');
const Notification = require('../models/Notification');
const { initializePayment, verifyPayment, verifyWebhookSignature } = require('../utils/paystackHelper');
const sendEmail = require('../utils/sendEmail');

// @route   POST /api/v1/payments/initialize
// @desc    Initialize Paystack payment
// @access  Private (student)
exports.initializePayment = async (req, res) => {
  try {
    const { courseId } = req.body;

    const student = await User.findById(req.user.id);
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if already enrolled
    if (student.enrolled.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course',
      });
    }

    // Initialize payment with Paystack
    const paymentData = await initializePayment(
      student.email,
      course.price,
      courseId,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: paymentData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   POST /api/v1/payments/webhook
// @desc    Handle Paystack webhook
// @access  Public (webhook)
exports.handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    const rawBody = req.body;
    const body = typeof rawBody === 'string' ? JSON.parse(rawBody) : Buffer.isBuffer(rawBody) ? JSON.parse(rawBody.toString()) : rawBody;

    // Verify webhook signature
    if (!verifyWebhookSignature(signature, rawBody)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid signature',
      });
    }

    const { event, data } = body;

    if (event === 'charge.success') {
      const { reference, metadata } = data;
      const { courseId, studentId } = metadata;

      // Create payment record
      const payment = await Payment.create({
        studentId,
        courseId,
        amount: data.amount / 100,
        method: 'Paystack',
        status: 'completed',
        ref: reference,
        paystackRef: reference,
        type: 'enrollment',
      });

      // Add course to student's enrolled list
      const student = await User.findByIdAndUpdate(
        studentId,
        { $addToSet: { enrolled: courseId } },
        { new: true }
      );

      // Update course enrollment count
      await Course.findByIdAndUpdate(courseId, { $inc: { enrolled: 1 } });

      // Create notification
      const course = await Course.findById(courseId);
      await Notification.create({
        userId: studentId,
        text: `You have successfully enrolled in ${course.title}`,
        type: 'enrollment',
        relatedId: courseId,
      });

      // Send enrollment confirmation email
      try {
        await sendEmail(
          student.email,
          'enrollmentConfirmation',
          student.name,
          course.title,
          data.amount / 100,
          reference
        );
      } catch (emailError) {
        console.warn('Enrollment email failed:', emailError.message);
      }

      console.log(`✓ Payment completed for student ${studentId}`);
    }

    res.status(200).json({
      success: true,
      message: 'Webhook processed',
    });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/v1/payments/verify/:reference
// @desc    Verify payment
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const paymentData = await verifyPayment(reference);

    res.status(200).json({
      success: true,
      data: paymentData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/v1/payments/my
// @desc    Get student's payment history
// @access  Private (student)
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ studentId: req.user.id })
      .populate('courseId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/v1/payments/all
// @desc    Get all payments (admin)
// @access  Private (admin)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('studentId', 'name email')
      .populate('courseId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   POST /api/v1/payments/payout
// @desc    Record instructor payout
// @access  Private (admin)
exports.processPayout = async (req, res) => {
  try {
    const { instructorId, amount, description } = req.body;

    const instructor = await User.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found',
      });
    }

    const payout = await Payment.create({
      instructorId,
      amount,
      status: 'completed',
      type: 'instructor_payout',
      ref: `PAYOUT-${Date.now()}`,
      date: new Date(),
    });

    // Create notification
    await Notification.create({
      userId: instructorId,
      text: `Payout of ₦${amount.toLocaleString()} has been processed`,
      type: 'payment',
    });

    // Send email
    try {
      await sendEmail(instructor.email, 'instructorPayout', instructor.name, amount, new Date().toLocaleDateString());
    } catch (emailError) {
      console.warn('Payout email failed:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Payout processed successfully',
      data: payout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
