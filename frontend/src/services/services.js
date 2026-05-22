import apiClient from './api.js';

/**
 * Authentication Service
 */
export const authService = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  getCurrentUser: () => apiClient.get('/auth/me'),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (token, data) => apiClient.post(`/auth/reset-password/${token}`, data),
};

/**
 * User Service
 */
export const userService = {
  getProfile: (username) => apiClient.get(`/users/profile/${username}`),
  updateProfile: (data) => apiClient.put('/users/update-profile', data),
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/users/upload-profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadCoverImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/users/upload-cover-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  changePassword: (data) => apiClient.put('/users/change-password', data),
  followUser: (userId) => apiClient.post(`/users/follow/${userId}`),
  unfollowUser: (userId) => apiClient.delete(`/users/unfollow/${userId}`),
  getFollowers: (username, page = 1) =>
    apiClient.get(`/users/followers/${username}?page=${page}`),
  getFollowing: (username, page = 1) =>
    apiClient.get(`/users/following/${username}?page=${page}`),
  getDashboard: () => apiClient.get('/users/dashboard'),
};

/**
 * Blog Service
 */
export const blogService = {
  getAllBlogs: (params) => apiClient.get('/blogs', { params }),
  getBlogBySlug: (slug) => apiClient.get(`/blogs/${slug}`),
  getCategories: () => apiClient.get('/blogs/categories'),
  getTags: () => apiClient.get('/blogs/tags'),
  createBlog: (data) => apiClient.post('/blogs', data),
  updateBlog: (blogId, data) => apiClient.put(`/blogs/${blogId}`, data),
  deleteBlog: (blogId) => apiClient.delete(`/blogs/${blogId}`),
  likeBlog: (blogId) => apiClient.post(`/blogs/${blogId}/like`),
  bookmarkBlog: (blogId) => apiClient.post(`/blogs/${blogId}/bookmark`),
  getBookmarks: () => apiClient.get('/blogs/bookmarks/all'),
  searchBlogs: (query, params) =>
    apiClient.get('/blogs/search', { params: { query, ...params } }),
  getRelatedBlogs: (blogId) => apiClient.get(`/blogs/${blogId}/related`),
  uploadFeaturedImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/blogs/upload/featured-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

/**
 * Comment Service
 */
export const commentService = {
  getComments: (blogId, params) =>
    apiClient.get(`/blogs/${blogId}/comments`, { params }),
  createComment: (blogId, data) =>
    apiClient.post(`/blogs/${blogId}/comments`, data),
  updateComment: (blogId, commentId, data) =>
    apiClient.put(`/blogs/${blogId}/comments/${commentId}`, data),
  deleteComment: (blogId, commentId) =>
    apiClient.delete(`/blogs/${blogId}/comments/${commentId}`),
  likeComment: (blogId, commentId) =>
    apiClient.post(`/blogs/${blogId}/comments/${commentId}/like`),
  reportComment: (blogId, commentId, data) =>
    apiClient.post(`/blogs/${blogId}/comments/${commentId}/report`, data),
};
