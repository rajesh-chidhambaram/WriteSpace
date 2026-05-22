import Blog from '../models/Blog.js';
import Category from '../models/Category.js';
import Tag from '../models/Tag.js';
import Bookmark from '../models/Bookmark.js';
import ReadingHistory from '../models/ReadingHistory.js';
import { HTTP_STATUS } from '../config/constants.js';
import { createBlogSchema, updateBlogSchema } from '../validators/blogValidator.js';
import { catchAsync } from '../middleware/error.js';
import { generateSlug, calculateReadingTime, generateExcerpt, getPaginationParams, buildPaginationMeta } from '../utils/stringUtils.js';
import { uploadImage } from '../utils/uploadUtils.js';

/**
 * Create Blog Post
 */
export const createBlog = catchAsync(async (req, res) => {
  const validatedData = createBlogSchema.parse(req.body);

  // Verify category exists
  const category = await Category.findById(validatedData.category);
  if (!category) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Category not found',
    });
  }

  // Verify tags exist
  if (validatedData.tags && validatedData.tags.length > 0) {
    const tags = await Tag.find({ _id: { $in: validatedData.tags } });
    if (tags.length !== validatedData.tags.length) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'One or more tags not found',
      });
    }
  }

  // Generate slug
  let slug = generateSlug(validatedData.title);
  let existingBlog = await Blog.findOne({ slug });
  let counter = 1;
  while (existingBlog) {
    slug = `${generateSlug(validatedData.title)}-${counter}`;
    existingBlog = await Blog.findOne({ slug });
    counter++;
  }

  // Calculate reading time
  const readingTimeMinutes = calculateReadingTime(validatedData.content);

  // Generate excerpt if not provided
  const excerpt = validatedData.excerpt || generateExcerpt(validatedData.content);

  // Create blog
  const blog = new Blog({
    ...validatedData,
    slug,
    excerpt,
    readingTimeMinutes,
    author: req.user._id,
    publishedAt: validatedData.status === 'published' ? new Date() : null,
  });

  await blog.save();
  await blog.populate('author', 'username firstName lastName profileImage');
  await blog.populate('category', 'name slug');
  await blog.populate('tags', 'name slug');

  // Update category post count if published
  if (validatedData.status === 'published') {
    category.postsCount += 1;
    await category.save();
  }

  // Update user's post count if published
  if (validatedData.status === 'published') {
    req.user.postsCount += 1;
    await req.user.save();
  }

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Blog created successfully',
    data: blog,
  });
});

/**
 * Get Blog By Slug
 */
export const getBlogBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;

  const blog = await Blog.findOne({ slug })
    .populate('author', 'username firstName lastName profileImage bio followersCount')
    .populate('category', 'name slug')
    .populate('tags', 'name slug');

  if (!blog) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Blog not found',
    });
  }

  // Increment view count
  blog.viewsCount += 1;
  await blog.save();

  // Track reading history if user is authenticated
  if (req.user) {
    await ReadingHistory.updateOne(
      { user: req.user._id, blog: blog._id },
      {
        user: req.user._id,
        blog: blog._id,
        lastReadAt: new Date(),
      },
      { upsert: true }
    );
  }

  // Check if user liked/bookmarked this blog
  let isLiked = false;
  let isBookmarked = false;
  if (req.user) {
    isLiked = blog.likedBy.includes(req.user._id);
    const bookmark = await Bookmark.findOne({ user: req.user._id, blog: blog._id });
    isBookmarked = !!bookmark;
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      blog,
      isLiked,
      isBookmarked,
    },
  });
});

/**
 * Update Blog
 */
export const updateBlog = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const validatedData = updateBlogSchema.parse(req.body);

  const blog = await Blog.findById(blogId);

  if (!blog) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Blog not found',
    });
  }

  // Check authorization
  if (blog.author.toString() !== req.user._id.toString()) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'You are not authorized to update this blog',
    });
  }

  // Update fields
  Object.assign(blog, validatedData);

  // Recalculate reading time if content changed
  if (validatedData.content) {
    blog.readingTimeMinutes = calculateReadingTime(validatedData.content);
    if (!validatedData.excerpt) {
      blog.excerpt = generateExcerpt(validatedData.content);
    }
  }

  // Update published date if status changed to published
  if (validatedData.status === 'published' && blog.status !== 'published') {
    blog.publishedAt = new Date();
    req.user.postsCount += 1;
    await req.user.save();
  }

  await blog.save();
  await blog.populate('author', 'username firstName lastName profileImage');
  await blog.populate('category', 'name slug');
  await blog.populate('tags', 'name slug');

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Blog updated successfully',
    data: blog,
  });
});

/**
 * Delete Blog
 */
export const deleteBlog = catchAsync(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId);

  if (!blog) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Blog not found',
    });
  }

  // Check authorization
  if (blog.author.toString() !== req.user._id.toString()) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'You are not authorized to delete this blog',
    });
  }

  // Update counts
  if (blog.status === 'published') {
    req.user.postsCount = Math.max(0, req.user.postsCount - 1);
    await req.user.save();

    const category = await Category.findById(blog.category);
    if (category) {
      category.postsCount = Math.max(0, category.postsCount - 1);
      await category.save();
    }
  }

  await Blog.findByIdAndDelete(blogId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Blog deleted successfully',
  });
});

/**
 * Get All Blogs (Paginated)
 */
export const getAllBlogs = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, category, tags, sort = 'latest' } = req.query;
  const { page: pageNum, limit: limitNum, skip } = getPaginationParams(page, limit);

  // Build filter
  const filter = { status: 'published' };
  if (category) {
    filter.category = category;
  }
  if (tags) {
    const tagArray = tags.split(',');
    filter.tags = { $in: tagArray };
  }

  // Build sort
  let sortObj = { createdAt: -1 };
  if (sort === 'popular') {
    sortObj = { viewsCount: -1 };
  } else if (sort === 'trending') {
    sortObj = { likesCount: -1 };
  }

  const blogs = await Blog.find(filter)
    .populate('author', 'username firstName lastName profileImage')
    .populate('category', 'name slug')
    .populate('tags', 'name slug')
    .skip(skip)
    .limit(limitNum)
    .sort(sortObj);

  const totalBlogs = await Blog.countDocuments(filter);
  const pagination = buildPaginationMeta(totalBlogs, pageNum, limitNum);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: blogs,
    pagination,
  });
});

/**
 * Like Blog
 */
export const likeBlog = catchAsync(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId);

  if (!blog) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Blog not found',
    });
  }

  // Check if already liked
  if (blog.likedBy.includes(req.user._id)) {
    // Unlike
    blog.likedBy = blog.likedBy.filter(id => id.toString() !== req.user._id.toString());
    blog.likesCount = Math.max(0, blog.likesCount - 1);
    await blog.save();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Blog unliked',
      isLiked: false,
      likesCount: blog.likesCount,
    });
  }

  // Like
  blog.likedBy.push(req.user._id);
  blog.likesCount += 1;
  await blog.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Blog liked',
    isLiked: true,
    likesCount: blog.likesCount,
  });
});

/**
 * Bookmark Blog
 */
export const bookmarkBlog = catchAsync(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Blog not found',
    });
  }

  // Check if already bookmarked
  const existing = await Bookmark.findOne({ user: req.user._id, blog: blogId });

  if (existing) {
    // Remove bookmark
    await Bookmark.deleteOne({ _id: existing._id });
    blog.bookmarksCount = Math.max(0, blog.bookmarksCount - 1);
    await blog.save();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Bookmark removed',
      isBookmarked: false,
    });
  }

  // Add bookmark
  const bookmark = new Bookmark({
    user: req.user._id,
    blog: blogId,
  });
  await bookmark.save();

  blog.bookmarksCount += 1;
  await blog.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Blog bookmarked',
    isBookmarked: true,
  });
});

/**
 * Get User Bookmarks
 */
export const getBookmarks = catchAsync(async (req, res) => {
  const bookmarks = await Bookmark.find({ user: req.user._id })
    .populate('blog')
    .sort({ createdAt: -1 });

  const bookmarkedBlogs = bookmarks
    .map(b => b.blog)
    .filter(blog => blog && blog.status === 'published');

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: bookmarkedBlogs,
  });
});

/**
 * Search Blogs
 */
export const searchBlogs = catchAsync(async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;

  if (!query) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Search query is required',
    });
  }

  const { page: pageNum, limit: limitNum, skip } = getPaginationParams(page, limit);

  const blogs = await Blog.find(
    {
      status: 'published',
      $text: { $search: query },
    },
    {
      score: { $meta: 'textScore' },
    }
  )
    .populate('author', 'username firstName lastName profileImage')
    .populate('category', 'name slug')
    .populate('tags', 'name slug')
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(limitNum);

  const totalResults = await Blog.countDocuments({
    status: 'published',
    $text: { $search: query },
  });

  const pagination = buildPaginationMeta(totalResults, pageNum, limitNum);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: blogs,
    pagination,
  });
});

/**
 * Get Related Blogs
 */
export const getRelatedBlogs = catchAsync(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId);

  if (!blog) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Blog not found',
    });
  }

  // Find blogs with same category or tags
  const related = await Blog.find({
    _id: { $ne: blogId },
    status: 'published',
    $or: [
      { category: blog.category },
      { tags: { $in: blog.tags } },
    ],
  })
    .populate('author', 'username firstName lastName profileImage')
    .populate('category', 'name slug')
    .limit(5)
    .sort({ createdAt: -1 });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: related,
  });
});

/**
 * Upload Featured Image
 */
export const uploadFeaturedImage = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'No image provided',
    });
  }

  const result = await uploadImage(req.file, 'writespace/featured');

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Image uploaded successfully',
    data: {
      url: result.url,
      publicId: result.public_id,
    },
  });
});

/**
 * Get all categories
 */
export const getCategories = catchAsync(async (req, res) => {
  const categories = await Category.find().select('_id name slug');
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: categories,
  });
});

/**
 * Get all tags
 */
export const getTags = catchAsync(async (req, res) => {
  const tags = await Tag.find().select('_id name slug');
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: tags,
  });
});
