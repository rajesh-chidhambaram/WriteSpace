import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function Settings() {
  return (
    <>
      <Helmet>
        <title>Settings - WriteSpace</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container py-12"
      >
        <h1 className="section-title">Settings</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-4xl">
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {['Profile', 'Password', 'Notifications', 'Privacy'].map((item) => (
                <button
                  key={item}
                  className="block w-full text-left px-4 py-2 rounded-lg hover:bg-cream transition-colors text-neutral-gray hover:text-sage-green"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
          <div className="lg:col-span-3 card p-6">
            <p className="text-neutral-gray">Settings content coming soon...</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
