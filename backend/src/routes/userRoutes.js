import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getUserProfile,
  updateProfile,
  uploadProfilePicture,
  uploadCoverImage,
  changePassword,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getUserDashboard,
} from '../controllers/userController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public routes
router.get('/profile/:username', getUserProfile);
router.get('/followers/:username', getFollowers);
router.get('/following/:username', getFollowing);

// Protected routes
router.put('/update-profile', authenticate, updateProfile);
router.post('/upload-profile-picture', authenticate, upload.single('image'), uploadProfilePicture);
router.post('/upload-cover-image', authenticate, upload.single('image'), uploadCoverImage);
router.put('/change-password', authenticate, changePassword);
router.post('/follow/:userId', authenticate, followUser);
router.delete('/unfollow/:userId', authenticate, unfollowUser);
router.get('/dashboard', authenticate, getUserDashboard);

export default router;
