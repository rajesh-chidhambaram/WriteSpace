import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { blogService, commentService, userService } from '../services/services.js';
import { useAuthStore } from '../context/store.js';
import { FiHeart, FiBookmark, FiShare2, FiMessageCircle, FiUser, FiCalendar, FiClock } from 'react-icons/fi';

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await blogService.getBlogBySlug(slug);
        
        if (response.data.success) {
          const blogData = response.data.data.blog;
          setBlog(blogData);
          setIsLiked(response.data.data.isLiked || false);
          setIsBookmarked(response.data.data.isBookmarked || false);

          // Fetch comments
          await fetchComments(blogData._id);

          // Fetch related blogs
          try {
            const relatedRes = await blogService.getRelatedBlogs(blogData._id);
            if (relatedRes.data.success) {
              setRelatedBlogs(relatedRes.data.data || []);
            }
          } catch (error) {
            console.error('Error fetching related blogs:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error('Failed to load blog');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug, navigate]);

  const fetchComments = async (blogId) => {
    try {
      setCommentsLoading(true);
      const response = await commentService.getComments(blogId, { page: 1, limit: 50 });
      if (response.data.success) {
        // Comments come directly in data array
        setComments(Array.isArray(response.data.data) ? response.data.data : []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like this blog');
      navigate('/login');
      return;
    }

    try {
      await blogService.likeBlog(blog._id);
      setIsLiked(!isLiked);
      setBlog(prev => ({
        ...prev,
        likesCount: isLiked ? prev.likesCount - 1 : prev.likesCount + 1
      }));
      toast.success(isLiked ? 'Blog unliked' : 'Blog liked!');
    } catch (error) {
      toast.error('Failed to like blog');
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error('Please login to bookmark this blog');
      navigate('/login');
      return;
    }

    try {
      await blogService.bookmarkBlog(blog._id);
      setIsBookmarked(!isBookmarked);
      toast.success(isBookmarked ? 'Bookmark removed' : 'Blog bookmarked!');
    } catch (error) {
      toast.error('Failed to bookmark blog');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to comment');
      navigate('/login');
      return;
    }

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const response = await commentService.createComment(blog._id, {
        content: commentText,
      });

      if (response.data.success) {
        setCommentText('');
        toast.success('Comment posted!');
        await fetchComments(blog._id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentService.deleteComment(blog._id, commentId);
      toast.success('Comment deleted');
      await fetchComments(blog._id);
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container py-12"
      >
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-soft-beige rounded"></div>
            <div className="h-80 bg-soft-beige rounded"></div>
            <div className="space-y-3">
              <div className="h-6 bg-soft-beige rounded w-3/4"></div>
              <div className="h-6 bg-soft-beige rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!blog) {
    return (
      <div className="container py-12">
        <div className="card p-8 text-center">
          <p className="text-neutral-gray">Blog not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.metaTitle || blog.title} - WriteSpace</title>
        <meta name="description" content={blog.metaDescription || blog.excerpt} />
        <meta name="keywords" content={blog.metaKeywords?.join(', ') || ''} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:image" content={blog.featuredImage} />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container py-12 pb-24"
      >
        {/* Featured Image */}
        {blog.featuredImage && (
          <motion.img
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-80 object-cover rounded-lg mb-8"
          />
        )}

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="badge bg-sage-green text-white">{blog.category?.name}</span>
                {blog.tags?.map(tag => (
                  <span key={tag._id} className="badge bg-pale-lavender text-dark-gray text-sm">
                    {tag.name}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl font-bold text-dark-gray mb-4">{blog.title}</h1>

              <p className="text-lg text-neutral-gray mb-6">{blog.excerpt}</p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 text-sm text-neutral-gray border-b border-soft-beige pb-6">
                <div className="flex items-center gap-2">
                  <FiCalendar size={16} />
                  {new Date(blog.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <FiClock size={16} />
                  {blog.readingTimeMinutes} min read
                </div>
                <div className="flex items-center gap-2">
                  Views: {blog.viewsCount || 0}
                </div>
              </div>
            </motion.div>

            {/* Author */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6 mb-8 flex items-center gap-4"
            >
              {blog.author?.profileImage ? (
                <img
                  src={blog.author.profileImage}
                  alt={blog.author.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-sage-green flex items-center justify-center text-white">
                  <FiUser size={24} />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-dark-gray">
                  {blog.author?.firstName} {blog.author?.lastName}
                </h3>
                <p className="text-sm text-neutral-gray">@{blog.author?.username}</p>
              </div>
            </motion.div>

            {/* Blog Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-8 mb-8 prose max-w-none"
            >
              <div className="text-dark-gray leading-relaxed whitespace-pre-wrap">
                {blog.content}
              </div>
            </motion.div>

            {/* Like, Bookmark, Share */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6 mb-8 flex items-center gap-4 justify-between border-t-4 border-sage-green"
            >
              <div className="flex items-center gap-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 transition-colors ${
                    isLiked ? 'text-red-500' : 'text-neutral-gray hover:text-red-500'
                  }`}
                >
                  <FiHeart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                  <span className="text-sm">{blog.likesCount || 0}</span>
                </button>

                <button
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 transition-colors ${
                    isBookmarked ? 'text-sage-green' : 'text-neutral-gray hover:text-sage-green'
                  }`}
                >
                  <FiBookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
                  <span className="text-sm">Save</span>
                </button>

                <button className="flex items-center gap-2 text-neutral-gray hover:text-blue-500 transition-colors">
                  <FiShare2 size={20} />
                  <span className="text-sm">Share</span>
                </button>
              </div>

              <div className="text-sm text-neutral-gray">
                {comments.length} <FiMessageCircle size={16} className="inline ml-2" />
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card p-8"
            >
              <h3 className="text-2xl font-bold text-dark-gray mb-6">Comments ({comments.length})</h3>

              {/* Add Comment */}
              {user ? (
                <form onSubmit={handleAddComment} className="mb-8 p-6 bg-warm-white rounded-lg border border-soft-beige">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows="3"
                    className="input-base w-full"
                  />
                  <div className="flex gap-4 mt-4">
                    <button type="submit" className="btn-primary">
                      Post Comment
                    </button>
                    <button
                      type="button"
                      onClick={() => setCommentText('')}
                      className="btn-ghost"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mb-8 p-6 bg-pale-lavender rounded-lg text-center">
                  <p className="text-neutral-gray mb-4">Sign in to comment on this blog</p>
                  <button onClick={() => navigate('/login')} className="btn-primary">
                    Sign In
                  </button>
                </div>
              )}

              {/* Comments List */}
              {commentsLoading ? (
                <div className="text-center text-neutral-gray py-8">Loading comments...</div>
              ) : comments.length > 0 ? (
                <div className="space-y-6">
                  {comments.map(comment => (
                    <div key={comment._id} className="border-l-4 border-soft-beige pl-6 py-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-dark-gray">
                            {comment.author?.firstName} {comment.author?.lastName}
                          </h4>
                          <p className="text-xs text-neutral-gray">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {user?._id === comment.author?._id && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-neutral-gray">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-gray">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            {/* Related Blogs */}
            {relatedBlogs.length > 0 && (
              <div className="card p-6 sticky top-24">
                <h3 className="text-xl font-bold text-dark-gray mb-6">Related Blogs</h3>
                <div className="space-y-4">
                  {relatedBlogs.slice(0, 5).map(relatedBlog => (
                    <motion.a
                      key={relatedBlog._id}
                      href={`/blog/${relatedBlog.slug}`}
                      whileHover={{ x: 5 }}
                      className="block p-4 rounded-lg bg-warm-white hover:bg-soft-beige transition-colors border border-soft-beige"
                    >
                      <h4 className="font-semibold text-dark-gray text-sm mb-2 line-clamp-2">
                        {relatedBlog.title}
                      </h4>
                      <p className="text-xs text-neutral-gray mb-2">{relatedBlog.readingTimeMinutes} min read</p>
                      <span className="text-xs badge bg-pale-lavender text-dark-gray">
                        {relatedBlog.category?.name}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
