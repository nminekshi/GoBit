# SMTP Email Configuration Guide

## Overview
The backend server is now configured with SMTP email functionality using Gmail. You can send emails for various purposes like welcome emails, password resets, notifications, etc.

## Configuration

### Environment Variables
The following environment variables have been added to your `.env` file:

```env
# SMTP Configuration for Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=akywoqjcelxbdess
EMAIL_FROM=your-email@gmail.com
```

### Important Setup Steps

1. **Update SMTP_USER and EMAIL_FROM**: Replace `your-email@gmail.com` with your actual Gmail address that you used to generate the app password.

2. **Google App Password**: The password `akywoqjcelxbdess` (formatted as `akyw oqjc elxb dess`) is already configured. This is a Google App password, not your regular Gmail password.

3. **Verify Gmail Settings**:
   - Make sure 2-Factor Authentication is enabled on your Gmail account
   - The app password should be generated from: https://myaccount.google.com/apppasswords

## Testing the Email Service

### Using the Test Endpoint

You can test the email functionality using the `/email/test` endpoint:

```bash
curl -X POST http://localhost:4000/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test Email",
    "message": "This is a test message"
  }'
```

### Using the Welcome Email Endpoint

```bash
curl -X POST http://localhost:4000/email/welcome \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "username": "John Doe"
  }'
```

## Available Email Functions

### In Your Code

```javascript
const { 
  sendEmail, 
  sendWelcomeEmail, 
  sendPasswordResetEmail, 
  verifyConnection 
} = require('./utils/emailService');

// Send a custom email
await sendEmail({
  to: 'user@example.com',
  subject: 'Custom Subject',
  text: 'Plain text content',
  html: '<h1>HTML content</h1>'
});

// Send a welcome email
await sendWelcomeEmail('user@example.com', 'John Doe');

// Send a password reset email
await sendPasswordResetEmail('user@example.com', 'reset-token-123');

// Verify SMTP connection
const isReady = await verifyConnection();
```

## API Endpoints

### POST /email/test
Test endpoint to send a basic email

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Optional custom subject",
  "message": "Optional custom message"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Test email sent successfully",
  "to": "recipient@example.com"
}
```

### POST /email/welcome
Send a welcome email to a new user

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "username": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Welcome email sent successfully",
  "email": "newuser@example.com"
}
```

## Server Startup Verification

When the server starts, it will automatically verify the SMTP connection:
- If successful: "SMTP server is ready to send emails"
- If failed: "Warning: SMTP server not configured properly. Email functionality may not work."

## Troubleshooting

### Common Issues

1. **Authentication Error**
   - Verify you're using a Google App Password, not your regular password
   - Make sure 2FA is enabled on your Google account
   - Generate a new app password if needed

2. **Connection Timeout**
   - Check if port 587 is not blocked by your firewall
   - Try using port 465 with SMTP_SECURE=true

3. **Emails Not Sending**
   - Check the server console for error messages
   - Verify the recipient email address is valid
   - Check Gmail's sent folder to confirm emails are being sent

### Testing Connection

You can check the server logs on startup. You should see:
```
Connected to MongoDB
SMTP server is ready to send emails
Server is running on port 4000
```

## Security Notes

- ✅ App passwords are stored in `.env` (not committed to git)
- ✅ `.env` is in `.gitignore` 
- ✅ `.env.example` has placeholders only
- ⚠️ Never commit your actual app password to version control
- ⚠️ Update the `SMTP_USER` and `EMAIL_FROM` fields with your actual email

## Next Steps

1. Update `SMTP_USER` and `EMAIL_FROM` in `.env` with your Gmail address
2. Restart the backend server to apply changes
3. Test the email functionality using the test endpoint
4. Integrate email sending into your auth routes (e.g., send welcome email on signup)
