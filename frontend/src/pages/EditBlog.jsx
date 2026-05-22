import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { blogService } from '../services/services.js';
import { useAuthStore } from '../context/store.js';

export default function EditBlog() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [blog, setBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });
  const [tagsInput, setTagsInput] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch blog and categories/tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch blog details
        const response = await blogService.getAllBlogs({ blogId });
        // Find blog by ID (simplified approach - using API that might not exist, use direct fetch)
        try {
          // Try to fetch from slug if we have it, or use search
          const allBlogs = response.data.data;
          const currentBlog = allBlogs.find(b => b._id === blogId);
          
          if (!currentBlog) {
            toast.error('Blog not found');
            navigate('/');
            return;
          }
          
          // Check if user is author
          if (currentBlog.author._id !== user._id) {
            toast.error('You can only edit your own blogs');
            navigate('/');
            return;
          }
          
          setBlog(currentBlog);
          setFormData({
            title: currentBlog.title,
            excerpt: currentBlog.excerpt,
            content: currentBlog.content,
            category: currentBlog.category._id,
            tags: currentBlog.tags.map(t => t._id),
            metaTitle: currentBlog.metaTitle,
            metaDescription: currentBlog.metaDescription,
            metaKeywords: currentBlog.metaKeywords?.join(', ') || '',
          });
        } catch (e) {
          console.error('Error finding blog:', e);
        }
        
        // Fetch categories and tags
        const [categoriesRes, tagsRes] = await Promise.all([
          blogService.getCategories(),
          blogService.getTags(),
        ]);
        setCategories(categoriesRes.data.data || []);
        setTags(tagsRes.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load blog');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchData();
    }
  }, [blogId, user._id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsInputBlur = () => {
    if (!tagsInput.trim()) return;

    const tagNames = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t);

    const selectedTagIds = tags
      .filter(tag => tagNames.some(name => tag.name.toLowerCase().includes(name) || name.includes(tag.name.toLowerCase())))
      .map(tag => tag._id);

    setFormData(prev => ({
      ...prev,
      tags: [...new Set([...prev.tags, ...selectedTagIds])]
    }));
    setTagsInput('');
  };

  const removeTag = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Content is required');
      return;
    }

    try {
      setSubmitting(true);

      const submitData = {
        title: formData.title,
        excerpt: formData.excerpt || formData.content.substring(0, 150),
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        metaTitle: formData.metaTitle || formData.title,
        metaDescription: formData.metaDescription || formData.excerpt,
        metaKeywords: formData.metaKeywords ? formData.metaKeywords.split(',').map(k => k.trim()) : [],
      };

      const response = await blogService.updateBlog(blogId, submitData);

      if (response.data.success) {
        toast.success('Blog updated successfully!');
        navigate(`/blog/${response.data.data.slug}`);
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error(error.response?.data?.message || 'Failed to update blog');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    try {
      setSubmitting(true);
      await blogService.deleteBlog(blogId);
      toast.success('Blog deleted successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete blog');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container py-12"
      >
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-soft-beige rounded"></div>
            <div className="h-64 bg-soft-beige rounded"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!blog) {
    return (
      <div className="container py-12">
        <div className="card p-8 text-center">
          <p className="text-neutral-gray">Blog not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Blog - WriteSpace</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container py-12 pb-24"
      >
        <h1 className="section-title">Edit Blog</h1>
        <p className="section-subtitle">Update your blog post</p>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="mb-6">
            <label className="block text-lg font-semibold text-dark-gray mb-2">
              Blog Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your blog title"
              className="input-base"
              maxLength={200}
              required
            />
            <p className="text-sm text-neutral-gray mt-1">{formData.title.length}/200</p>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-semibold text-dark-gray mb-2">
              Excerpt
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Brief summary of your blog"
              rows="2"
              maxLength={300}
              className="input-base resize-none"
            />
            <p className="text-sm text-neutral-gray mt-1">{formData.excerpt.length}/300</p>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-semibold text-dark-gray mb-2">
              Blog Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your blog content here..."
              rows="12"
              className="input-base resize-none font-mono"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-semibold text-dark-gray mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-base"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-semibold text-dark-gray mb-2">
              Tags
            </label>
            <div className="mb-2">
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onBlur={handleTagsInputBlur}
                placeholder="Start typing a tag name..."
                className="input-base"
              />
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tagId => {
                  const tag = tags.find(t => t._id === tagId);
                  return (
                    <div key={tagId} className="badge bg-sage-green text-white flex items-center gap-2">
                      {tag?.name}
                      <button type="button" onClick={() => removeTag(tagId)} className="hover:text-red-200">
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card p-6 mb-6 border-2 border-pale-lavender">
            <h3 className="text-lg font-semibold text-dark-gray mb-4">SEO Metadata</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-dark-gray mb-2">
                Meta Title
              </label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                maxLength={60}
                className="input-base text-sm"
              />
              <p className="text-xs text-neutral-gray mt-1">{formData.metaTitle.length}/60</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-dark-gray mb-2">
                Meta Description
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows="2"
                maxLength={160}
                className="input-base text-sm resize-none"
              />
              <p className="text-xs text-neutral-gray mt-1">{formData.metaDescription.length}/160</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-gray mb-2">
                Keywords
              </label>
              <input
                type="text"
                name="metaKeywords"
                value={formData.metaKeywords}
                onChange={handleChange}
                className="input-base text-sm"
              />
            </div>
          </div>

          <div className="flex gap-4 sticky bottom-0 bg-white py-4 border-t-2 border-soft-beige">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? 'Updating...' : 'Update Blog'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={submitting}
              className="btn-ghost flex-1 text-red-500 hover:bg-red-50"
            >
              {submitting ? 'Deleting...' : 'Delete Blog'}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}
