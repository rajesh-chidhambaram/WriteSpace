import User from '../models/User.js';
import { HTTP_STATUS, USER_ROLES } from '../config/constants.js';
import { generateToken, generateRefreshToken, generateResetToken } from '../utils/tokenUtils.js';
import { registerSchema, loginSchema, passwordResetSchema, resetPasswordSchema } from '../validators/userValidator.js';
import { sendEmail, welcomeEmailTemplate, passwordResetEmailTemplate } from '../utils/emailUtils.js';
import { catchAsync, AppError } from '../middleware/error.js';
import crypto from 'crypto';

/**
 * User Registration
 */
export const register = catchAsync(async (req, res) => {
  // Validate input
  const validatedData = registerSchema.parse(req.body);

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email: validatedData.email }, { username: validatedData.username }],
  });

  if (existingUser) {
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message: existingUser.email === validatedData.email
        ? 'Email already registered'
        : 'Username already taken',
    });
  }

  // Create new user
  const user = new User({
    username: validatedData.username,
    email: validatedData.email,
    password: validatedData.password,
    firstName: validatedData.firstName,
    lastName: validatedData.lastName,
    role: USER_ROLES.READER,
  });

  await user.save();

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Set cookies
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  // Send welcome email
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await sendEmail(user.email, 'Welcome to WriteSpace', welcomeEmailTemplate(user.username, verificationLink));

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: user.getPublicProfile(),
      token,
    },
  });
});

/**
 * User Login
 */
export const login = catchAsync(async (req, res) => {
  // Validate input
  const validatedData = loginSchema.parse(req.body);

  // Find user
  const user = await User.findOne({ email: validatedData.email }).select('+password');

  if (!user || !(await user.comparePassword(validatedData.password))) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  if (!user.isActive) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Your account has been deactivated',
    });
  }

  // Update last login
  user.lastLogin = new Date();
  user.loginAttempts = 0;
  await user.save();

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Set cookies
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.getPublicProfile(),
      token,
    },
  });
});

/**
 * Logout
 */
export const logout = catchAsync(async (req, res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * Refresh Token
 */
export const refreshAccessToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Refresh token not found',
    });
  }

  // This would normally verify the refresh token
  // For now, we'll just generate a new token
  if (!req.user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  const token = generateToken(req.user._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Token refreshed',
    data: { token },
  });
});

/**
 * Forgot Password
 */
export const forgotPassword = catchAsync(async (req, res) => {
  const validatedData = passwordResetSchema.parse(req.body);

  const user = await User.findOne({ email: validatedData.email });

  if (!user) {
    // Don't reveal if email exists
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link',
    });
  }

  // Generate reset token
  const resetToken = generateResetToken();
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  // Send reset email
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await sendEmail(user.email, 'Reset Your Password', passwordResetEmailTemplate(user.username, resetLink));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'If an account exists with this email, you will receive a password reset link',
  });
});

/**
 * Reset Password
 */
export const resetPassword = catchAsync(async (req, res) => {
  const { token } = req.params;
  const validatedData = resetPasswordSchema.parse(req.body);

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: new Date() },
  });

  if (!user) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Invalid or expired reset token',
    });
  }

  // Update password
  user.password = validatedData.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Password reset successfully',
  });
});

/**
 * Get Current User
 */
export const getCurrentUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: user.getPublicProfile(),
  });
});
