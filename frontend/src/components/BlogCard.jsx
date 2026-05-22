import { Link } from 'react-router-dom';
import { FiHeart, FiMessageCircle, FiBookmark } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

export default function BlogCard({ blog, onLike, onBookmark, isLiked, isBookmarked }) {
  return (
    <Link to={`/blog/${blog.slug}`}>
      <div className="card overflow-hidden hover:shadow-lg transition-all duration-300 h-full cursor-pointer group">
        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="h-48 w-full overflow-hidden bg-soft-beige">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="p-6">
          {/* Category Badge */}
          {blog.category && (
            <div className="badge mb-3 bg-pale-lavender text-dark-gray">
              {blog.category.name}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold text-dark-gray mb-2 line-clamp-2 group-hover:text-sage-green transition-colors">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-neutral-gray text-sm mb-4 line-clamp-2">
            {blog.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-2 text-xs text-neutral-gray mb-4">
            <span>{blog.readingTimeMinutes} min read</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}</span>
          </div>

          {/* Author */}
          {blog.author && (
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-soft-beige border-opacity-20">
              {blog.author.profileImage && (
                <img
                  src={blog.author.profileImage}
                  alt={blog.author.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-sm font-medium text-dark-gray">
                  {blog.author.firstName || blog.author.username}
                </p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-neutral-gray text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FiHeart size={16} />
                <span>{blog.likesCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiMessageCircle size={16} />
                <span>{blog.commentsCount}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs">{blog.viewsCount} views</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
