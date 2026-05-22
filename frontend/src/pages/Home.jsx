import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import BlogCard from '../components/BlogCard.jsx';
import { SkeletonLoader, PageSkeleton } from '../components/SkeletonLoader.jsx';
import { blogService } from '../services/services.js';
import { useAuthStore } from '../context/store.js';
import toast from 'react-hot-toast';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingBlogs, setTrendingBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // Fetch latest blogs
        const response = await blogService.getAllBlogs({ page: 1, limit: 6, sort: 'latest' });
        setBlogs(response.data.data);

        // Fetch trending blogs
        const trendingResponse = await blogService.getAllBlogs({
          page: 1,
          limit: 3,
          sort: 'trending',
        });
        setTrendingBlogs(trendingResponse.data.data);
      } catch (error) {
        toast.error('Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Helmet>
        <title>WriteSpace - Modern Blogging Platform</title>
        <meta
          name="description"
          content="Share your thoughts and stories with the world on WriteSpace, the modern blogging platform."
        />
        <meta name="keywords" content="blog, writing, reading, articles, stories" />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-warm-white via-cream to-light-peach py-20 md:py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="section-title text-5xl md:text-6xl mb-6">
              Welcome to WriteSpace
            </h1>
            <p className="text-xl text-neutral-gray mb-8 leading-relaxed">
              Discover, share, and celebrate the art of writing. Connect with writers
              and readers who share your passion for great content.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate('/explore')}
                className="btn-primary text-lg flex items-center gap-2"
              >
                Explore Stories
                <FiArrowRight />
              </button>
              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/register')}
                  className="btn-secondary text-lg"
                >
                  Start Writing
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending Section */}
      {trendingBlogs.length > 0 && (
        <section className="py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title">Trending Now</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading ? (
                  <SkeletonLoader count={3} type="card" />
                ) : (
                  trendingBlogs.map((blog) => (
                    <motion.div key={blog._id} variants={item} initial="hidden" whileInView="show">
                      <BlogCard blog={blog} />
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Latest Stories Section */}
      <section className="py-16 bg-cream">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="section-title">Latest Stories</h2>
              <button
                onClick={() => navigate('/explore')}
                className="btn-ghost text-sage-green flex items-center gap-2"
              >
                View All
                <FiArrowRight />
              </button>
            </div>

            {loading ? (
              <PageSkeleton />
            ) : blogs.length > 0 ? (
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {blogs.map((blog) => (
                  <motion.div key={blog._id} variants={item}>
                    <BlogCard blog={blog} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-gray text-lg">No blogs yet. Be the first to write!</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-sage-green text-white">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold font-display mb-4">Ready to share your story?</h2>
              <p className="text-lg opacity-90 mb-8">
                Join thousands of writers and start your blogging journey today.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-sage-green px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Get Started for Free
              </button>
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
}
