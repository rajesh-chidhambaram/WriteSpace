import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    // Content
    title: {
      type: String,
      required: [true, 'Please provide a blog title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      minlength: [5, 'Title must be at least 5 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    markdown: {
      type: String,
      default: null,
    },

    // Media
    featuredImage: {
      type: String,
      default: null,
    },
    images: [String],

    // Author
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Categorization
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    tags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
    }],

    // Status
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    publishedAt: Date,

    // SEO
    metaTitle: {
      type: String,
      maxlength: [160, 'Meta title cannot exceed 160 characters'],
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters'],
    },
    metaKeywords: [String],
    canonicalUrl: String,

    // Statistics
    viewsCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    bookmarksCount: {
      type: Number,
      default: 0,
    },
    sharesCount: {
      type: Number,
      default: 0,
    },

    // Reading Time
    readingTimeMinutes: Number,

    // Engagement
    likedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    bookmarkedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],

    // Settings
    commentsEnabled: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isSponsored: {
      type: Boolean,
      default: false,
    },

    // Related Articles
    relatedArticles: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
blogSchema.index({ slug: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ viewsCount: -1 });
blogSchema.index({ likesCount: -1 });
blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' }); // Full-text search
blogSchema.index({ createdAt: -1 });

// Virtual for average rating if reviews exist
blogSchema.virtual('avgRating').get(function() {
  return this.likesCount > 0 ? (this.likesCount / (this.viewsCount || 1)).toFixed(2) : 0;
});

export default mongoose.model('Blog', blogSchema);
