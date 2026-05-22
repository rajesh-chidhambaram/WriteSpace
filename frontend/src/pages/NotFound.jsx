import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiHome, FiSearch } from 'react-icons/fi';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found - WriteSpace</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-cream">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center px-4"
        >
          <h1 className="text-9xl font-bold text-sage-green font-display mb-4">404</h1>
          <h2 className="text-3xl font-bold text-dark-gray mb-3 font-display">Page Not Found</h2>
          <p className="text-neutral-gray text-lg mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/" className="btn-primary flex items-center gap-2">
              <FiHome />
              Go Home
            </Link>
            <Link to="/explore" className="btn-secondary flex items-center gap-2">
              <FiSearch />
              Explore Blogs
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
