const express = require('express');
const router = express.Router();
const { sendEmail, sendWelcomeEmail } = require('../utils/emailService');

/**
 * POST /email/test
 * Test endpoint to send a test email
 */
router.post('/test', async (req, res) => {
    try {
        const { to, subject, message } = req.body;

        if (!to) {
            return res.status(400).json({ message: 'Recipient email is required' });
        }

        const emailSubject = subject || 'Test Email from FYP App';
        const emailText = message || 'This is a test email from your FYP application.';
        const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>${emailSubject}</h2>
        <p>${emailText}</p>
        <p style="margin-top: 20px; color: #666;">This is an automated test email.</p>
      </div>
    `;

        await sendEmail({
            to,
            subject: emailSubject,
            text: emailText,
            html: emailHtml,
        });

        res.json({
            success: true,
            message: 'Test email sent successfully',
            to
        });
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send test email',
            error: error.message
        });
    }
});

/**
 * POST /email/welcome
 * Send welcome email to a user
 */
router.post('/welcome', async (req, res) => {
    try {
        const { email, username } = req.body;

        if (!email || !username) {
            return res.status(400).json({
                message: 'Email and username are required'
            });
        }

        await sendWelcomeEmail(email, username);

        res.json({
            success: true,
            message: 'Welcome email sent successfully',
            email
        });
    } catch (error) {
        console.error('Welcome email error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send welcome email',
            error: error.message
        });
    }
});

module.exports = router;
