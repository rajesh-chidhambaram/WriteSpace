import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from '../../context/store.js';
import { FiMenu, FiSearch, FiHome, FiPenTool, FiLogOut, FiUser } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../../services/services.js';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-soft-beige border-opacity-20 shadow-sm">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-sage-green font-display">WriteSpace</div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base pl-4 pr-10"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray hover:text-sage-green transition-colors"
            >
              <FiSearch size={20} />
            </button>
          </div>
        </form>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link to="/explore" className="btn-ghost">
                Explore
              </Link>
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link to="/create" className="btn-primary hidden sm:block">
                <FiPenTool className="inline mr-2" />
                Write
              </Link>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 rounded-full bg-sage-green text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <FiUser size={20} />
                  )}
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-soft-beige py-2">
                    <Link
                      to={`/profile/${user?.username}`}
                      className="block px-4 py-2 hover:bg-cream transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FiUser className="inline mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-cream transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 hover:bg-cream transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Settings
                    </Link>
                    <hr className="my-2 border-soft-beige border-opacity-20" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-cream transition-colors text-red-600"
                    >
                      <FiLogOut className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Menu Toggle */}
          <button
            onClick={toggleSidebar}
            className="md:hidden btn-ghost p-2"
          >
            <FiMenu size={20} />
          </button>
        </nav>
      </div>
    </header>
  );
}
