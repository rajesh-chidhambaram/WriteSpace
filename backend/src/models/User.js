import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      lowercase: true,
      match: [/^[a-zA-Z0-9_-]*$/, 'Username can only contain letters, numbers, underscores, and hyphens'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },

    // Profile
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    profileImage: {
      type: String,
      default: null,
    },
    coverImage: {
      type: String,
      default: null,
    },
    website: {
      type: String,
      default: null,
    },

    // Social Links
    socialLinks: {
      twitter: String,
      linkedin: String,
      github: String,
      instagram: String,
    },

    // Account Settings
    role: {
      type: String,
      enum: ['reader', 'author', 'admin'],
      default: 'reader',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpire: Date,

    // OAuth
    googleId: String,
    googleEmail: String,
    isOAuthUser: {
      type: Boolean,
      default: false,
    },

    // Statistics
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    postsCount: {
      type: Number,
      default: 0,
    },
    bookmarksCount: {
      type: Number,
      default: 0,
    },

    // Preferences
    notifications: {
      email: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
      newFollower: { type: Boolean, default: true },
      newComment: { type: Boolean, default: true },
      newLike: { type: Boolean, default: true },
    },
    theme: {
      type: String,
      default: 'light', // light theme only
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    deactivatedAt: Date,

    // Metadata
    lastLogin: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ googleId: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  if (this.firstName || this.lastName) {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }
  return this.username;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const profile = this.toObject();
  delete profile.password;
  delete profile.emailVerificationToken;
  delete profile.passwordResetToken;
  delete profile.googleId;
  delete profile.loginAttempts;
  delete profile.lockUntil;
  return profile;
};

export default mongoose.model('User', userSchema);
