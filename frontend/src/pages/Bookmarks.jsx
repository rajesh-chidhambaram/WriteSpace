import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { blogService } from '../services/services.js';
import { useAuthStore } from '../context/store.js';
import { FiBookmark, FiEye, FiHeart, FiCalendar, FiClock } from 'react-icons/fi';

export default function Bookmarks() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        // Fetch user's bookmarks from new endpoint
        const response = await blogService.getBookmarks();
        if (response.data.success) {
          setBookmarks(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (blogId) => {
    try {
      await blogService.bookmarkBlog(blogId);
      setBookmarks(bookmarks.filter(b => b._id !== blogId));
      toast.success('Bookmark removed');
    } catch (error) {
      toast.error('Failed to remove bookmark');
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container py-12"
      >
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-soft-beige rounded"></div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Bookmarks - WriteSpace</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container py-12 pb-24"
      >
        <h1 className="section-title">My Bookmarks</h1>
        <p className="section-subtitle">Your saved articles and stories</p>

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto mt-12">
            {bookmarks.map((blog, idx) => (
              <motion.a
                key={blog._id}
                href={`/blog/${blog.slug}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge bg-sage-green text-white">{blog.category?.name}</span>
                      <FiBookmark className="text-sage-green" size={16} />
                    </div>
                    <h3 className="text-xl font-bold text-dark-gray mb-2">{blog.title}</h3>
                    <p className="text-neutral-gray mb-4 line-clamp-2">{blog.excerpt}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-neutral-gray">
                      <div className="flex items-center gap-1">
                        <FiCalendar size={16} />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock size={16} />
                        {blog.readingTimeMinutes} min read
                      </div>
                      <div className="flex items-center gap-1">
                        <FiEye size={16} />
                        {blog.viewsCount || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <FiHeart size={16} />
                        {blog.likesCount || 0}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveBookmark(blog._id);
                    }}
                    className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                    title="Remove bookmark"
                  >
                    <FiBookmark className="text-red-500" size={20} fill="currentColor" />
                  </button>
                </div>
              </motion.a>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <FiBookmark size={48} className="mx-auto text-neutral-gray mb-4 opacity-30" />
            <p className="text-neutral-gray text-lg mb-4">No bookmarks yet</p>
            <p className="text-sm text-neutral-gray mb-6">Start bookmarking blogs to save them for later</p>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
