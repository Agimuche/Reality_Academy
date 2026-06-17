const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

// Create transporter with SendGrid
const transporter = nodemailer.createTransport(
  sgTransport({
    service: 'SendGrid',
    auth: {
      api_key: process.env.SENDGRID_API_KEY || 'test-key',
    },
  })
);

// Email templates
const emailTemplates = {
  welcome: (name, email) => ({
    subject: '🎓 Welcome to The Reality Academy!',
    html: `
      <h2>Welcome to The Reality Academy, ${name}!</h2>
      <p>Thank you for registering. We're excited to have you join our community of learners and educators.</p>
      <p>Your email: <strong>${email}</strong></p>
      <p>You can now log in to your account and start exploring our courses.</p>
      <p>Best regards,<br>The Reality Academy Team</p>
    `,
  }),

  enrollmentConfirmation: (name, courseName, amount, ref) => ({
    subject: `📚 Enrollment Confirmed: ${courseName}`,
    html: `
      <h2>Enrollment Confirmation</h2>
      <p>Hi ${name},</p>
      <p>Welcome to <strong>${courseName}</strong>! Your enrollment is confirmed.</p>
      <p><strong>Payment Details:</strong></p>
      <ul>
        <li>Amount Paid: ₦${amount.toLocaleString()}</li>
        <li>Reference: ${ref}</li>
        <li>Date: ${new Date().toLocaleDateString()}</li>
      </ul>
      <p>You can now access all course materials. Start learning today!</p>
      <p>Best regards,<br>The Reality Academy Team</p>
    `,
  }),

  assignmentSubmitted: (instructorName, studentName, assignmentTitle) => ({
    subject: `📝 Assignment Submitted: ${assignmentTitle}`,
    html: `
      <h2>New Assignment Submission</h2>
      <p>Hi ${instructorName},</p>
      <p><strong>${studentName}</strong> has submitted the assignment: <strong>${assignmentTitle}</strong></p>
      <p>Please review and provide feedback.</p>
      <p>Best regards,<br>The Reality Academy Team</p>
    `,
  }),

  assignmentGraded: (studentName, assignmentTitle, score, feedback) => ({
    subject: `✅ Assignment Graded: ${assignmentTitle}`,
    html: `
      <h2>Assignment Graded</h2>
      <p>Hi ${studentName},</p>
      <p>Your assignment <strong>${assignmentTitle}</strong> has been graded.</p>
      <p><strong>Score: ${score}/100</strong></p>
      <p><strong>Feedback:</strong></p>
      <p>${feedback}</p>
      <p>Best regards,<br>The Reality Academy Team</p>
    `,
  }),

  passwordReset: (name, resetLink) => ({
    subject: '🔐 Password Reset Request',
    html: `
      <h2>Password Reset</h2>
      <p>Hi ${name},</p>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p><strong>This link expires in 10 minutes.</strong></p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>The Reality Academy Team</p>
    `,
  }),

  attendanceAbsent: (studentName, courseName, date) => ({
    subject: `📋 Attendance Alert: ${courseName}`,
    html: `
      <h2>Attendance Notification</h2>
      <p>Hi ${studentName},</p>
      <p>You were marked <strong>absent</strong> from <strong>${courseName}</strong> on ${date}.</p>
      <p>If this is an error, please contact your instructor.</p>
      <p>Best regards,<br>The Reality Academy Team</p>
    `,
  }),

  instructorPayout: (instructorName, amount, date) => ({
    subject: `💰 Payment Processed: ₦${amount.toLocaleString()}`,
    html: `
      <h2>Instructor Payout</h2>
      <p>Hi ${instructorName},</p>
      <p>A payout has been processed for you.</p>
      <p><strong>Amount: ₦${amount.toLocaleString()}</strong></p>
      <p><strong>Date: ${date}</strong></p>
      <p>The funds will be transferred to your registered account.</p>
      <p>Best regards,<br>The Reality Academy Team</p>
    `,
  }),
};

// Send email function
const sendEmail = async (email, templateKey, ...args) => {
  try {
    if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'test-key') {
      console.log(`📧 Email would be sent to ${email} (SENDGRID_API_KEY not configured)`);
      return { success: true, message: 'Email queued (demo mode)' };
    }

    const template = emailTemplates[templateKey]?.(...args);
    if (!template) {
      throw new Error(`Email template '${templateKey}' not found`);
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@realityacademy.edu',
      to: email,
      subject: template.subject,
      html: template.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✓ Email sent to ${email}`);
    return result;
  } catch (error) {
    console.error(`✗ Email sending error: ${error.message}`);
    throw error;
  }
};

module.exports = sendEmail;
