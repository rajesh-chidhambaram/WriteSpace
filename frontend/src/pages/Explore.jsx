import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import BlogCard from '../components/BlogCard.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import { SkeletonLoader } from '../components/SkeletonLoader.jsx';
import { blogService } from '../services/services.js';
import toast from 'react-hot-toast';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'latest');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 12,
          sort: sortBy,
        };
        if (selectedCategory) {
          params.category = selectedCategory;
        }

        const response = await blogService.getAllBlogs(params);
        setBlogs(response.data.data);
        setPagination(response.data.pagination);
      } catch (error) {
        toast.error('Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page, sortBy, selectedCategory]);

  const filters = [
    {
      id: 'sort',
      label: 'Sort By',
      options: [
        { id: 'latest', label: 'Latest', checked: sortBy === 'latest' },
        { id: 'popular', label: 'Most Popular', checked: sortBy === 'popular' },
        { id: 'trending', label: 'Trending', checked: sortBy === 'trending' },
      ],
    },
  ];

  const handleFilterChange = (filterId, optionId, checked) => {
    if (filterId === 'sort') {
      setSortBy(optionId);
      setPage(1);
    }
  };

  return (
    <>
      <Helmet>
        <title>Explore - WriteSpace</title>
        <meta name="description" content="Explore thousands of great stories and articles on WriteSpace" />
      </Helmet>

      <div className="container py-12">
        <div className="mb-12">
          <h1 className="section-title">Explore Stories</h1>
          <p className="section-subtitle">
            Discover amazing content from writers around the world
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SkeletonLoader count={6} type="card" />
              </div>
            ) : blogs.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
                >
                  {blogs.map((blog) => (
                    <motion.div
                      key={blog._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <BlogCard blog={blog} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mb-8">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={!pagination.hasPrevPage}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          page === p
                            ? 'bg-sage-green text-white'
                            : 'bg-cream text-dark-gray hover:bg-soft-beige'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                      disabled={!pagination.hasNextPage}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-neutral-gray text-lg">No blogs found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
