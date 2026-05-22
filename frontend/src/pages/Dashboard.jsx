import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { blogService, userService } from '../services/services.js';
import { useAuthStore } from '../context/store.js';
import { FiEdit2, FiTrash2, FiEye, FiHeart, FiMessageCircle, FiPlus } from 'react-icons/fi';

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    followers: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch user dashboard data
        const dashboardRes = await userService.getDashboard();
        if (dashboardRes.data.success) {
          const data = dashboardRes.data.data;
          setDashboardData(data);
          setStats({
            totalPosts: data.stats?.totalPosts || 0,
            totalViews: data.stats?.totalViews || 0,
            totalLikes: data.stats?.totalLikes || 0,
            followers: data.stats?.followers || 0,
          });
          setBlogs(data.recentBlogs || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        // If dashboard API doesn't exist, fetch blogs directly
        try {
          const blogsRes = await blogService.getAllBlogs({ limit: 10 });
          if (blogsRes.data.success) {
            const userBlogs = blogsRes.data.data.filter(b => b.author._id === user._id);
            setBlogs(userBlogs);
            
            let totalViews = 0;
            let totalLikes = 0;
            userBlogs.forEach(blog => {
              totalViews += blog.viewsCount || 0;
              totalLikes += blog.likesCount || 0;
            });
            
            setStats({
              totalPosts: userBlogs.length,
              totalViews,
              totalLikes,
              followers: 0,
            });
          }
        } catch (e) {
          console.error('Error fetching blogs:', e);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      await blogService.deleteBlog(blogId);
      toast.success('Blog deleted');
      setBlogs(blogs.filter(b => b._id !== blogId));
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container py-12"
      >
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-soft-beige rounded"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - WriteSpace</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container py-12 pb-24"
      >
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="section-title">My Dashboard</h1>
            <p className="section-subtitle">Welcome back, {user?.firstName}!</p>
          </div>
          <Link to="/create" className="btn-primary flex items-center gap-2">
            <FiPlus /> New Blog
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="card p-6 text-center border-t-4 border-sage-green"
          >
            <p className="text-neutral-gray text-sm mb-2">Total Posts</p>
            <p className="text-4xl font-bold text-sage-green">{stats.totalPosts}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 text-center border-t-4 border-light-peach"
          >
            <p className="text-neutral-gray text-sm mb-2">Total Views</p>
            <p className="text-4xl font-bold text-light-peach">{stats.totalViews}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 text-center border-t-4 border-red-500"
          >
            <p className="text-neutral-gray text-sm mb-2">Total Likes</p>
            <p className="text-4xl font-bold text-red-500">{stats.totalLikes}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6 text-center border-t-4 border-blue-500"
          >
            <p className="text-neutral-gray text-sm mb-2">Followers</p>
            <p className="text-4xl font-bold text-blue-500">{stats.followers}</p>
          </motion.div>
        </div>

        {/* Recent Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h2 className="text-2xl font-bold text-dark-gray mb-6">Recent Posts</h2>
          
          {blogs.length > 0 ? (
            <div className="space-y-4">
              {blogs.map(blog => (
                <div key={blog._id} className="border border-soft-beige rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-dark-gray mb-2">{blog.title}</h3>
                      <p className="text-sm text-neutral-gray mb-3 line-clamp-2">{blog.excerpt}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-neutral-gray">
                        <div className="flex items-center gap-1">
                          <FiEye size={16} /> {blog.viewsCount || 0} views
                        </div>
                        <div className="flex items-center gap-1">
                          <FiHeart size={16} /> {blog.likesCount || 0} likes
                        </div>
                        <div className="flex items-center gap-1">
                          <FiMessageCircle size={16} /> {blog.commentsCount || 0} comments
                        </div>
                        <span className="badge bg-sage-green text-white text-xs">
                          {blog.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/edit/${blog._id}`}
                        className="p-2 rounded-lg bg-sage-green text-white hover:opacity-90 transition-opacity"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="p-2 rounded-lg bg-red-500 text-white hover:opacity-90 transition-opacity"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-gray mb-4">You haven't published any blogs yet</p>
              <Link to="/create" className="btn-primary">
                Write Your First Blog
              </Link>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
