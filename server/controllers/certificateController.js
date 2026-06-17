const { jsPDF } = require('jspdf');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User');
const Course = require('../models/Course');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @route   GET /api/v1/certificates/:courseId
// @desc    Generate certificate PDF and upload to Cloudinary
// @access  Private (student)
exports.generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = await User.findById(req.user.id);
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const progress = user.progress?.get(courseId.toString()) || 0;
    if (progress < 80) {
      return res.status(403).json({
        success: false,
        message: 'Certificate is only available after 80% completion',
      });
    }

    const verificationId = uuidv4();
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFillColor('#4169E1');
    doc.rect(0, 0, 297, 210, 'F');
    doc.setTextColor('#ffffff');
    doc.setFontSize(36);
    doc.text('Certificate of Completion', 148, 50, { align: 'center' });

    doc.setFontSize(20);
    doc.text(`This is to certify that`, 148, 80, { align: 'center' });
    doc.setFontSize(30);
    doc.text(user.name, 148, 100, { align: 'center' });

    doc.setFontSize(18);
    doc.text(`has successfully completed the course`, 148, 120, { align: 'center' });
    doc.setFontSize(24);
    doc.text(course.title, 148, 140, { align: 'center' });

    doc.setFontSize(16);
    doc.text(`Completion Date: ${new Date().toLocaleDateString()}`, 148, 160, { align: 'center' });
    doc.text(`Certificate ID: ${verificationId}`, 148, 176, { align: 'center' });

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    const streamifier = require('streamifier');

    const uploadPromise = () =>
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'reality-academy/certificates',
            resource_type: 'raw',
            public_id: `certificate-${verificationId}`,
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );

        streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
      });

    const result = await uploadPromise();

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        verificationId,
      },
    });
  } catch (error) {
    console.error('Certificate generation error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
