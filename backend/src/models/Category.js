import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    icon: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: '#E5D7C8', // Soft beige as default
    },
    postsCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ slug: 1 });
categorySchema.index({ name: 1 });

export default mongoose.model('Category', categorySchema);
