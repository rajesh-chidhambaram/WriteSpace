import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { blogService } from '../services/services.js';
import { useAuthStore } from '../context/store.js';

export default function CreateBlog() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    status: 'published',
  });
  const [featuredImage, setFeaturedImage] = useState(null);
  const [tagsInput, setTagsInput] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch categories and tags on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          blogService.getCategories(),
          blogService.getTags(),
        ]);
        setCategories(categoriesRes.data.data || []);
        setTags(tagsRes.data.data || []);
      } catch (error) {
        console.error('Error fetching categories/tags:', error);
        toast.error('Failed to load categories and tags');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setFeaturedImage(file);
    }
  };

  const handleTagsInputChange = (e) => {
    setTagsInput(e.target.value);
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

    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    try {
      setLoading(true);

      let imageUrl = null;

      // Upload featured image first if provided
      if (featuredImage) {
        try {
          const imageRes = await blogService.uploadFeaturedImage(featuredImage);
          imageUrl = imageRes.data.data.url;
        } catch (error) {
          toast.error('Failed to upload featured image');
          return;
        }
      }

      // Create blog with proper JSON data
      const submitData = {
        title: formData.title,
        excerpt: formData.excerpt || formData.content.substring(0, 150),
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        status: formData.status,
        metaTitle: formData.metaTitle || formData.title,
        metaDescription: formData.metaDescription || formData.excerpt,
        metaKeywords: formData.metaKeywords ? formData.metaKeywords.split(',').map(k => k.trim()) : [],
      };

      if (imageUrl) {
        submitData.featuredImage = imageUrl;
      }

      const response = await blogService.createBlog(submitData);

      if (response.data.success) {
        toast.success(formData.status === 'published' ? 'Blog published successfully!' : 'Blog saved as draft!');
        navigate(`/blog/${response.data.data.slug}`);
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to create blog';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDraft = (e) => {
    e.preventDefault();
    setFormData(prev => ({
      ...prev,
      status: 'draft'
    }));
    // Trigger submit
    setTimeout(() => {
      document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true }));
    }, 0);
  };

  return (
    <>
      <Helmet>
        <title>Create Blog - WriteSpace</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container py-12 pb-24"
      >
        <h1 className="section-title">Create New Blog</h1>
        <p className="section-subtitle">
          Share your thoughts with the world. Write, edit, and publish your stories.
        </p>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Title */}
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

          {/* Excerpt */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-dark-gray mb-2">
              Excerpt (Short Summary)
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Brief summary of your blog (optional - auto-generated if not provided)"
              rows="2"
              maxLength={300}
              className="input-base resize-none"
            />
            <p className="text-sm text-neutral-gray mt-1">{formData.excerpt.length}/300</p>
          </div>

          {/* Content */}
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

          {/* Featured Image */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-dark-gray mb-2">
              Featured Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="input-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-sage-green file:text-white hover:file:bg-opacity-90"
            />
            <p className="text-sm text-neutral-gray mt-1">Max 5MB. Recommended: 1200x600px</p>
            {featuredImage && (
              <p className="text-sm text-sage-green mt-2">✓ Image selected: {featuredImage.name}</p>
            )}
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-dark-gray mb-2">
              Category *
            </label>
            {categories.length === 0 ? (
              <p className="text-sm text-red-500">Loading categories...</p>
            ) : (
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
            )}
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-dark-gray mb-2">
              Tags
            </label>
            <div className="mb-2">
              <input
                type="text"
                value={tagsInput}
                onChange={handleTagsInputChange}
                onBlur={handleTagsInputBlur}
                placeholder="Start typing a tag name..."
                className="input-base"
                list="tags-list"
              />
              <datalist id="tags-list">
                {tags.filter(tag => !formData.tags.includes(tag._id)).map(tag => (
                  <option key={tag._id} value={tag.name} />
                ))}
              </datalist>
              <p className="text-sm text-neutral-gray mt-1">
                Type tag name and press Tab or click away to add
              </p>
            </div>

            {/* Selected tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map(tagId => {
                  const tag = tags.find(t => t._id === tagId);
                  return (
                    <div
                      key={tagId}
                      className="badge bg-sage-green text-white flex items-center gap-2"
                    >
                      {tag?.name || 'Unknown'}
                      <button
                        type="button"
                        onClick={() => removeTag(tagId)}
                        className="hover:text-red-200 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SEO Section */}
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
                placeholder="Leave empty to use blog title"
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
                placeholder="Leave empty to use excerpt"
                rows="2"
                maxLength={160}
                className="input-base text-sm resize-none"
              />
              <p className="text-xs text-neutral-gray mt-1">{formData.metaDescription.length}/160</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-gray mb-2">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                name="metaKeywords"
                value={formData.metaKeywords}
                onChange={handleChange}
                placeholder="e.g., blog, writing, content"
                className="input-base text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 sticky bottom-0 bg-white py-4 border-t-2 border-soft-beige">
            <button
              type="button"
              onClick={handleDraft}
              disabled={loading}
              className="btn-secondary flex-1"
            >
              {loading ? 'Processing...' : 'Save as Draft'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Publishing...' : 'Publish Now'}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}
