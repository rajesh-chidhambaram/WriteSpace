import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  likeComment,
  reportComment,
} from '../controllers/commentController.js';

const router = express.Router({ mergeParams: true });

// Public routes
router.get('/', getComments);

// Protected routes
router.post('/', authenticate, createComment);
router.put('/:commentId', authenticate, updateComment);
router.delete('/:commentId', authenticate, deleteComment);
router.post('/:commentId/like', authenticate, likeComment);
router.post('/:commentId/report', authenticate, reportComment);

export default router;
