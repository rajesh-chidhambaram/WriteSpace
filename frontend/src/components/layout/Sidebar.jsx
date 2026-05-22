import { useUIStore, useAuthStore } from '../../context/store.js';
import { Link } from 'react-router-dom';
import { FiHome, FiCompass, FiBookmark, FiSettings, FiX } from 'react-icons/fi';

export default function Sidebar() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const links = [
    { href: '/', label: 'Home', icon: FiHome },
    { href: '/explore', label: 'Explore', icon: FiCompass },
  ];

  if (isAuthenticated) {
    links.push({ href: '/bookmarks', label: 'Bookmarks', icon: FiBookmark });
    links.push({ href: '/settings', label: 'Settings', icon: FiSettings });
  }

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative left-0 top-16 w-64 h-[calc(100vh-64px)] bg-white border-r border-soft-beige border-opacity-20 transform transition-transform duration-300 md:translate-x-0 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Close Button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden absolute top-4 right-4 btn-ghost p-2"
          >
            <FiX size={20} />
          </button>

          {/* Navigation Links */}
          <nav className="space-y-2 mt-8 md:mt-0">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cream transition-colors text-dark-gray hover:text-sage-green"
                onClick={toggleSidebar}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
