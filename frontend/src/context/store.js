import { create } from 'zustand';

/**
 * Authentication Store
 * Manages user authentication state
 */
export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token, isAuthenticated: !!token });
  },
  setLoading: (loading) => set({ loading }),
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

/**
 * Blog Store
 * Manages blog-related state
 */
export const useBlogStore = create((set) => ({
  blogs: [],
  currentBlog: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },

  setBlogs: (blogs) => set({ blogs }),
  setCurrentBlog: (blog) => set({ currentBlog: blog }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setPagination: (pagination) => set({ pagination }),
}));

/**
 * UI Store
 * Manages UI-related state
 */
export const useUIStore = create((set) => ({
  theme: 'light', // Always light theme
  sidebarOpen: false,
  notifications: [],

  setTheme: () => set({ theme: 'light' }), // Always light
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, { id: Date.now(), ...notification }],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

/**
 * User Store
 * Manages user profile and dashboard state
 */
export const useUserStore = create((set) => ({
  profile: null,
  stats: null,
  followers: [],
  following: [],
  bookmarks: [],
  readingHistory: [],

  setProfile: (profile) => set({ profile }),
  setStats: (stats) => set({ stats }),
  setFollowers: (followers) => set({ followers }),
  setFollowing: (following) => set({ following }),
  setBookmarks: (bookmarks) => set({ bookmarks }),
  setReadingHistory: (history) => set({ readingHistory: history }),
}));
