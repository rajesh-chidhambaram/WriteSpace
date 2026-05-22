import express from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import {
  createBlog,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  likeBlog,
  bookmarkBlog,
  getBookmarks,
  searchBlogs,
  getRelatedBlogs,
  uploadFeaturedImage,
  getCategories,
  getTags,
} from '../controllers/blogController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public routes
router.get('/', optionalAuth, getAllBlogs);
router.get('/search', searchBlogs);
router.get('/categories', getCategories);
router.get('/tags', getTags);
router.get('/bookmarks/all', authenticate, getBookmarks);
router.get('/:blogId/related', getRelatedBlogs);
router.get('/:slug', optionalAuth, getBlogBySlug);

// Protected routes
router.post('/', authenticate, createBlog);
router.put('/:blogId', authenticate, updateBlog);
router.delete('/:blogId', authenticate, deleteBlog);
router.post('/:blogId/like', authenticate, likeBlog);
router.post('/:blogId/bookmark', authenticate, bookmarkBlog);
router.post('/upload/featured-image', authenticate, upload.single('image'), uploadFeaturedImage);

export default router;
