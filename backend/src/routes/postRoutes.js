import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLikePost,
  getCategoriesAndTags,
} from '../controllers/postController.js';
import {
  getCommentsByPost,
  createComment,
} from '../controllers/commentController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Metadata endpoint
router.get('/metadata/categories', getCategoriesAndTags);

// Post CRUD endpoints
router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.route('/:id')
  .get(optionalAuth, getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

// Like/unlike endpoint
router.post('/:id/like', protect, toggleLikePost);

// Nested comment routes for a post
router.route('/:postId/comments')
  .get(getCommentsByPost)
  .post(protect, createComment);

export default router;
