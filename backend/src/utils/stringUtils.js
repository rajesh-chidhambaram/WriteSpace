/**
 * Create URL-friendly slug
 */
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Calculate reading time (average 200 words per minute)
 */
export const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

/**
 * Generate excerpt from content
 */
export const generateExcerpt = (content, length = 150) => {
  const plainText = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
  
  if (plainText.length <= length) return plainText;
  return plainText.slice(0, length).trim() + '...';
};

/**
 * Format date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Get time ago (e.g., '2 hours ago')
 */
export const getTimeAgo = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [name, secondsInInterval] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInInterval);
    if (interval >= 1) {
      return `${interval} ${name}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

/**
 * Paginate results
 */
export const getPaginationParams = (page = 1, limit = 10, maxLimit = 100) => {
  page = Math.max(1, parseInt(page) || 1);
  limit = Math.min(Math.max(1, parseInt(limit) || 10), maxLimit);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Build pagination metadata
 */
export const buildPaginationMeta = (totalItems, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    currentPage: page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
