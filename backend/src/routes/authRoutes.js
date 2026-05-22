import express from 'express';
import { register, login, logout, refreshAccessToken, forgotPassword, resetPassword, getCurrentUser } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.post('/logout', authenticate, logout);
router.post('/refresh-token', authenticate, refreshAccessToken);
router.get('/me', authenticate, getCurrentUser);

export default router;
