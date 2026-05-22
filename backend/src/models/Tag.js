import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [30, 'Tag name cannot exceed 30 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    postsCount: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: '#C4B5A0', // Muted sage green
    },
  },
  {
    timestamps: true,
  }
);

tagSchema.index({ name: 1 });
tagSchema.index({ slug: 1 });
tagSchema.index({ postsCount: -1 });

export default mongoose.model('Tag', tagSchema);
