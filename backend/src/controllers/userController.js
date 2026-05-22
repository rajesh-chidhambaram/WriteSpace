import User from '../models/User.js';
import Follower from '../models/Follower.js';
import Blog from '../models/Blog.js';
import { HTTP_STATUS } from '../config/constants.js';
import { updateProfileSchema, changePasswordSchema } from '../validators/userValidator.js';
import { catchAsync, AppError } from '../middleware/error.js';
import { uploadImage } from '../utils/uploadUtils.js';

/**
 * Get User Profile
 */
export const getUserProfile = catchAsync(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username: username.toLowerCase() });

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'User not found',
    });
  }

  // Get follower status if authenticated
  let isFollowing = false;
  if (req.user) {
    const followerRecord = await Follower.findOne({
      follower: req.user._id,
      following: user._id,
    });
    isFollowing = !!followerRecord;
  }

  // Get user's published blogs
  const blogs = await Blog.find({ author: user._id, status: 'published' })
    .select('title slug excerpt viewsCount likesCount createdAt featuredImage')
    .limit(6)
    .sort({ createdAt: -1 });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      user: user.getPublicProfile(),
      isFollowing,
      recentBlogs: blogs,
    },
  });
});

/**
 * Update User Profile
 */
export const updateProfile = catchAsync(async (req, res) => {
  const validatedData = updateProfileSchema.parse(req.body);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    validatedData,
    { new: true, runValidators: true }
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Profile updated successfully',
    data: user.getPublicProfile(),
  });
});

/**
 * Upload Profile Picture
 */
export const uploadProfilePicture = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'No image provided',
    });
  }

  const result = await uploadImage(req.file, 'writespace/profiles');
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profileImage: result.url },
    { new: true }
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Profile picture updated',
    data: {
      profileImage: result.url,
    },
  });
});

/**
 * Upload Cover Image
 */
export const uploadCoverImage = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'No image provided',
    });
  }

  const result = await uploadImage(req.file, 'writespace/covers');
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { coverImage: result.url },
    { new: true }
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Cover image updated',
    data: {
      coverImage: result.url,
    },
  });
});

/**
 * Change Password
 */
export const changePassword = catchAsync(async (req, res) => {
  const validatedData = changePasswordSchema.parse(req.body);

  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  const isPasswordValid = await user.comparePassword(validatedData.currentPassword);
  if (!isPasswordValid) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  // Update password
  user.password = validatedData.newPassword;
  await user.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Password changed successfully',
  });
});

/**
 * Follow User
 */
export const followUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  if (userId === req.user._id.toString()) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'You cannot follow yourself',
    });
  }

  const targetUser = await User.findById(userId);
  if (!targetUser) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'User not found',
    });
  }

  // Check if already following
  const existing = await Follower.findOne({
    follower: req.user._id,
    following: userId,
  });

  if (existing) {
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message: 'You are already following this user',
    });
  }

  // Create follower relationship
  const follower = new Follower({
    follower: req.user._id,
    following: userId,
  });
  await follower.save();

  // Update counts
  req.user.followingCount += 1;
  targetUser.followersCount += 1;
  await req.user.save();
  await targetUser.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'User followed successfully',
  });
});

/**
 * Unfollow User
 */
export const unfollowUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const followerRecord = await Follower.findOneAndDelete({
    follower: req.user._id,
    following: userId,
  });

  if (!followerRecord) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'You are not following this user',
    });
  }

  // Update counts
  req.user.followingCount = Math.max(0, req.user.followingCount - 1);
  const targetUser = await User.findById(userId);
  if (targetUser) {
    targetUser.followersCount = Math.max(0, targetUser.followersCount - 1);
    await targetUser.save();
  }
  await req.user.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'User unfollowed successfully',
  });
});

/**
 * Get User's Followers
 */
export const getFollowers = catchAsync(async (req, res) => {
  const { username } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'User not found',
    });
  }

  const skip = (page - 1) * limit;
  const followers = await Follower.find({ following: user._id })
    .populate('follower', 'username firstName lastName profileImage bio')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const totalFollowers = await Follower.countDocuments({ following: user._id });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      followers: followers.map(f => f.follower),
      pagination: {
        currentPage: parseInt(page),
        limit: parseInt(limit),
        total: totalFollowers,
        pages: Math.ceil(totalFollowers / limit),
      },
    },
  });
});

/**
 * Get User's Following
 */
export const getFollowing = catchAsync(async (req, res) => {
  const { username } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'User not found',
    });
  }

  const skip = (page - 1) * limit;
  const following = await Follower.find({ follower: user._id })
    .populate('following', 'username firstName lastName profileImage bio')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const totalFollowing = await Follower.countDocuments({ follower: user._id });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      following: following.map(f => f.following),
      pagination: {
        currentPage: parseInt(page),
        limit: parseInt(limit),
        total: totalFollowing,
        pages: Math.ceil(totalFollowing / limit),
      },
    },
  });
});

/**
 * Get User Dashboard
 */
export const getUserDashboard = catchAsync(async (req, res) => {
  const user = req.user;

  // Get user's blog statistics
  const blogs = await Blog.find({ author: user._id });
  const publishedBlogs = blogs.filter(b => b.status === 'published');
  const draftBlogs = blogs.filter(b => b.status === 'draft');

  const totalViews = publishedBlogs.reduce((sum, b) => sum + b.viewsCount, 0);
  const totalLikes = publishedBlogs.reduce((sum, b) => sum + b.likesCount, 0);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      user: user.getPublicProfile(),
      stats: {
        totalBlogs: blogs.length,
        publishedBlogs: publishedBlogs.length,
        draftBlogs: draftBlogs.length,
        totalViews,
        totalLikes,
        followers: user.followersCount,
        following: user.followingCount,
      },
      recentBlogs: publishedBlogs.slice(0, 5),
    },
  });
});
