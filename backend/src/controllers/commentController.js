import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';
import { HTTP_STATUS } from '../config/constants.js';
import { createCommentSchema, updateCommentSchema, reportCommentSchema } from '../validators/commentValidator.js';
import { catchAsync } from '../middleware/error.js';
import { getPaginationParams, buildPaginationMeta } from '../utils/stringUtils.js';

/**
 * Create Comment
 */
export const createComment = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const validatedData = createCommentSchema.parse(req.body);

  // Check if blog exists
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Blog not found',
    });
  }

  if (!blog.commentsEnabled) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Comments are disabled for this blog',
    });
  }

  // Create comment
  const comment = new Comment({
    content: validatedData.content,
    author: req.user._id,
    blog: blogId,
    parentComment: validatedData.parentComment || null,
  });

  await comment.save();
  await comment.populate('author', 'username firstName lastName profileImage');

  // If it's a reply, add to parent's replies
  if (validatedData.parentComment) {
    await Comment.findByIdAndUpdate(
      validatedData.parentComment,
      { $push: { replies: comment._id } },
      { new: true }
    );
  }

  // Update blog comment count
  blog.commentsCount += 1;
  await blog.save();

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Comment created successfully',
    data: comment,
  });
});

/**
 * Get Blog Comments
 */
export const getComments = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const { page: pageNum, limit: limitNum, skip } = getPaginationParams(page, limit);

  const comments = await Comment.find({ blog: blogId, parentComment: null })
    .populate('author', 'username firstName lastName profileImage')
    .populate({
      path: 'replies',
      populate: { path: 'author', select: 'username firstName lastName profileImage' },
    })
    .skip(skip)
    .limit(limitNum)
    .sort({ createdAt: -1 });

  const totalComments = await Comment.countDocuments({ blog: blogId, parentComment: null });
  const pagination = buildPaginationMeta(totalComments, pageNum, limitNum);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: comments,
    pagination,
  });
});

/**
 * Update Comment
 */
export const updateComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const validatedData = updateCommentSchema.parse(req.body);

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Comment not found',
    });
  }

  // Check authorization
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'You are not authorized to update this comment',
    });
  }

  comment.content = validatedData.content;
  comment.isEdited = true;
  comment.editedAt = new Date();
  await comment.save();
  await comment.populate('author', 'username firstName lastName profileImage');

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Comment updated successfully',
    data: comment,
  });
});

/**
 * Delete Comment
 */
export const deleteComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Comment not found',
    });
  }

  // Check authorization (author or admin)
  if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'You are not authorized to delete this comment',
    });
  }

  // Delete comment and its replies
  await Comment.deleteMany({ _id: { $in: [commentId, ...comment.replies] } });

  // Update blog comment count
  const blog = await Blog.findById(comment.blog);
  if (blog) {
    blog.commentsCount = Math.max(0, blog.commentsCount - 1 - comment.replies.length);
    await blog.save();
  }

  // Remove from parent's replies if it's a reply
  if (comment.parentComment) {
    await Comment.findByIdAndUpdate(
      comment.parentComment,
      { $pull: { replies: commentId } }
    );
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Comment deleted successfully',
  });
});

/**
 * Like Comment
 */
export const likeComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Comment not found',
    });
  }

  // Check if already liked
  if (comment.likes.includes(req.user._id)) {
    // Unlike
    comment.likes = comment.likes.filter(id => id.toString() !== req.user._id.toString());
    comment.likesCount = Math.max(0, comment.likesCount - 1);
    await comment.save();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Comment unliked',
      isLiked: false,
      likesCount: comment.likesCount,
    });
  }

  // Like
  comment.likes.push(req.user._id);
  comment.likesCount += 1;
  await comment.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Comment liked',
    isLiked: true,
    likesCount: comment.likesCount,
  });
});

/**
 * Report Comment
 */
export const reportComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const validatedData = reportCommentSchema.parse(req.body);

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Comment not found',
    });
  }

  // Check if already reported by this user
  const existingReport = comment.reports.find(
    r => r.reportedBy.toString() === req.user._id.toString()
  );

  if (existingReport) {
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message: 'You have already reported this comment',
    });
  }

  // Add report
  comment.reports.push({
    reportedBy: req.user._id,
    reason: validatedData.reason,
  });

  // Mark as reported if it has multiple reports
  if (comment.reports.length >= 3) {
    comment.isReported = true;
  }

  await comment.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Comment reported successfully',
  });
});
