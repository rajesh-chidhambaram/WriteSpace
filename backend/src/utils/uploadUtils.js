import cloudinary from '../config/cloudinary.js';
import { FILE_UPLOAD } from '../config/constants.js';

/**
 * Upload Image to Cloudinary
 */
export const uploadImage = async (file, folder = 'writespace') => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file
    if (!FILE_UPLOAD.ALLOWED_FORMATS.includes(file.mimetype)) {
      throw new Error('Invalid file format. Only JPEG, PNG, WebP, and GIF are allowed.');
    }

    if (file.size > FILE_UPLOAD.MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum allowed size of 5MB`);
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );

      uploadStream.end(file.buffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    throw error;
  }
};

/**
 * Delete Image from Cloudinary
 */
export const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log('✓ Image deleted:', publicId);
  } catch (error) {
    console.error('✗ Cloudinary delete error:', error.message);
  }
};

/**
 * Get Optimized Image URL
 */
export const getOptimizedImageUrl = (url, width = 800, height = 600) => {
  if (!url) return null;
  
  if (url.includes('cloudinary.com')) {
    // Replace upload with upload/w_width,h_height,c_fill,q_auto,f_auto
    return url.replace(
      '/upload/',
      `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`
    );
  }
  
  return url;
};

/**
 * Generate Thumbnail
 */
export const generateThumbnail = (url, width = 300, height = 200) => {
  return getOptimizedImageUrl(url, width, height);
};
