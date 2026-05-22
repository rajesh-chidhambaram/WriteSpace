import mongoose from 'mongoose';

const readingHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
    readAt: {
      type: Date,
      default: Date.now,
    },
    lastReadAt: {
      type: Date,
      default: Date.now,
    },
    scrollPosition: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: false,
  }
);

// Compound unique index - one entry per user per blog
readingHistorySchema.index({ user: 1, blog: 1 }, { unique: true });
readingHistorySchema.index({ user: 1, lastReadAt: -1 });

export default mongoose.model('ReadingHistory', readingHistorySchema);
