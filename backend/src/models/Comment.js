import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    // Content
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
      trim: true,
    },

    // Author
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Parent Content
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },

    // Nested Comments
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    replies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    }],

    // Engagement
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    likesCount: {
      type: Number,
      default: 0,
    },

    // Status
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
    isReported: {
      type: Boolean,
      default: false,
    },
    reports: [{
      reportedBy: mongoose.Schema.Types.ObjectId,
      reason: String,
      timestamp: { type: Date, default: Date.now },
    }],
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
commentSchema.index({ blog: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ createdAt: -1 });

export default mongoose.model('Comment', commentSchema);
