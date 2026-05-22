import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  return (
    <>
      <Helmet>
        <title>Search Results - WriteSpace</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container py-12"
      >
        <h1 className="section-title">Search Results</h1>
        <p className="section-subtitle">Results for "{query}"</p>
        <div className="text-center py-12 text-neutral-gray">
          Search results will appear here...
        </div>
      </motion.div>
    </>
  );
}
