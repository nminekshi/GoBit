const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body (optional if html is provided)
 * @param {string} options.html - HTML body (optional if text is provided)
 * @returns {Promise} - Promise resolving to message info
 */
const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME || 'FYP App'}" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

/**
 * Send a welcome email
 * @param {string} email - Recipient email
 * @param {string} username - User's name
 */
const sendWelcomeEmail = async (email, username) => {
    const subject = 'Welcome to FYP App!';
    const text = `Hello ${username},\n\nWelcome to our application! We're excited to have you on board.\n\nBest regards,\nThe FYP Team`;
    const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Hello ${username},</h2>
      <p>Welcome to our application! We're excited to have you on board.</p>
      <p>Best regards,<br/>The FYP Team</p>
    </div>
  `;

    return await sendEmail({ to: email, subject, text, html });
};

/**
 * Send a password reset email
 * @param {string} email - Recipient email
 * @param {string} resetToken - Password reset token
 */
const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    const subject = 'Password Reset Request';
    const text = `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nIf you didn't request this, please ignore this email.`;
    const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Click the button below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p style="margin-top: 20px;">If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    </div>
  `;

    return await sendEmail({ to: email, subject, text, html });
};

/**
 * Verify SMTP connection
 * @returns {Promise<boolean>} - Returns true if connection is successful
 */
const verifyConnection = async () => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log('SMTP server is ready to send emails');
        return true;
    } catch (error) {
        console.error('SMTP connection error:', error);
        return false;
    }
};

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    verifyConnection,
};
