import nodemailer from 'nodemailer';

/**
 * Email Transporter Configuration
 */
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send Email
 */
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✓ Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('✗ Email error:', error.message);
    return false;
  }
};

/**
 * Welcome Email Template
 */
export const welcomeEmailTemplate = (username, verificationLink) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Inter', sans-serif; background-color: #f5f1ed; }
          .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
          .header { text-align: center; margin-bottom: 30px; }
          h1 { color: #2c2416; font-size: 24px; margin: 0; }
          p { color: #6b6b6b; line-height: 1.6; }
          .btn { display: inline-block; background: #d4a574; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin: 20px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to WriteSpace</h1>
          </div>
          <p>Hi ${username},</p>
          <p>Thank you for joining WriteSpace! We're excited to have you on board.</p>
          <p>Please verify your email address by clicking the button below:</p>
          <center>
            <a href="${verificationLink}" class="btn">Verify Email</a>
          </center>
          <p>If the button doesn't work, copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666; font-size: 12px;">${verificationLink}</p>
          <div class="footer">
            <p>© ${new Date().getFullYear()} WriteSpace. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Password Reset Email Template
 */
export const passwordResetEmailTemplate = (username, resetLink) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Inter', sans-serif; background-color: #f5f1ed; }
          .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
          .header { text-align: center; margin-bottom: 30px; }
          h1 { color: #2c2416; font-size: 24px; margin: 0; }
          p { color: #6b6b6b; line-height: 1.6; }
          .btn { display: inline-block; background: #d4a574; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin: 20px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
          .warning { background: #fff3cd; padding: 15px; border-radius: 4px; color: #856404; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <p>Hi ${username},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <center>
            <a href="${resetLink}" class="btn">Reset Password</a>
          </center>
          <div class="warning">
            <strong>Security Note:</strong> This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </div>
          <p>If the button doesn't work, copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666; font-size: 12px;">${resetLink}</p>
          <div class="footer">
            <p>© ${new Date().getFullYear()} WriteSpace. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
