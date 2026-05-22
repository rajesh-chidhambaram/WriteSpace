import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { userService, blogService } from '../services/services.js';
import { useAuthStore } from '../context/store.js';
import { FiUser, FiMapPin, FiLink, FiEdit2, FiUserPlus, FiUserMinus } from 'react-icons/fi';

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [tab, setTab] = useState('blogs');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // If no username, use current user
        const profileUsername = username || currentUser?.username;
        
        if (!profileUsername) {
          navigate('/');
          return;
        }

        // Fetch user profile
        const profileRes = await userService.getProfile(profileUsername);
        if (profileRes.data.success) {
          setProfile(profileRes.data.data);
          setIsFollowing(profileRes.data.data.isFollowing || false);
        }

        // Fetch user's blogs
        try {
          const blogsRes = await blogService.getAllBlogs({ limit: 100 });
          if (blogsRes.data.success) {
            const userBlogs = blogsRes.data.data.filter(b => b.author.username === profileUsername && b.status === 'published');
            setBlogs(userBlogs);
          }
        } catch (e) {
          console.error('Error fetching blogs:', e);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Profile not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (username || currentUser) {
      fetchProfile();
    }
  }, [username, currentUser, navigate]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await userService.unfollowUser(profile._id);
        setIsFollowing(false);
        toast.success('Unfollowed');
      } else {
        await userService.followUser(profile._id);
        setIsFollowing(true);
        toast.success('Followed!');
      }
    } catch (error) {
      toast.error('Failed to follow user');
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container py-12"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-40 bg-soft-beige rounded animate-pulse"></div>
          <div className="h-32 bg-soft-beige rounded animate-pulse"></div>
        </div>
      </motion.div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-12">
        <div className="card p-8 text-center">
          <p className="text-neutral-gray">Profile not found</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.username === profile.username;

  return (
    <>
      <Helmet>
        <title>{`${profile?.firstName || 'User'} ${profile?.lastName || ''} - WriteSpace`}</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container py-12 pb-24"
      >
        {/* Cover and Avatar */}
        <div className="max-w-4xl mx-auto">
          {/* Cover Image */}
          <div className="h-40 bg-gradient-to-r from-sage-green to-light-peach rounded-lg mb-6 relative">
            {profile.coverImage && (
              <img
                src={profile.coverImage}
                alt="Cover"
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 mb-8"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-sage-green flex items-center justify-center text-white overflow-hidden -mt-16">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={profile.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser size={40} />
                  )}
                </div>

                {/* Info */}
                <div>
                  <h1 className="text-3xl font-bold text-dark-gray">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-neutral-gray">@{profile.username}</p>
                  {profile.bio && (
                    <p className="text-dark-gray mt-2">{profile.bio}</p>
                  )}
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-neutral-gray">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <FiMapPin size={16} /> {profile.location}
                      </div>
                    )}
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-sage-green"
                      >
                        <FiLink size={16} /> {profile.website.split('//')[1]}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {isOwnProfile ? (
                <button className="btn-primary flex items-center gap-2">
                  <FiEdit2 /> Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  className={isFollowing ? 'btn-secondary flex items-center gap-2' : 'btn-primary flex items-center gap-2'}
                >
                  {isFollowing ? (
                    <>
                      <FiUserMinus /> Unfollow
                    </>
                  ) : (
                    <>
                      <FiUserPlus /> Follow
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-6 mb-8"
          >
            <div className="card p-6 text-center">
              <p className="text-neutral-gray text-sm mb-2">Posts</p>
              <p className="text-3xl font-bold text-sage-green">{profile.postsCount || 0}</p>
            </div>
            <div className="card p-6 text-center">
              <p className="text-neutral-gray text-sm mb-2">Followers</p>
              <p className="text-3xl font-bold text-light-peach">{profile.followersCount || 0}</p>
            </div>
            <div className="card p-6 text-center">
              <p className="text-neutral-gray text-sm mb-2">Following</p>
              <p className="text-3xl font-bold text-pale-lavender">{profile.followingCount || 0}</p>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex gap-4 mb-6 border-b border-soft-beige">
              <button
                onClick={() => setTab('blogs')}
                className={`pb-4 font-semibold transition-colors ${
                  tab === 'blogs'
                    ? 'text-sage-green border-b-2 border-sage-green'
                    : 'text-neutral-gray hover:text-dark-gray'
                }`}
              >
                Blog Posts ({blogs.length})
              </button>
            </div>

            {/* Blogs Grid */}
            {tab === 'blogs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.length > 0 ? (
                  blogs.map((blog, idx) => (
                    <motion.a
                      key={blog._id}
                      href={`/blog/${blog.slug}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="card p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="mb-3">
                        <span className="badge bg-sage-green text-white text-sm">
                          {blog.category?.name}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-dark-gray mb-2 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-neutral-gray mb-4 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      <div className="text-xs text-neutral-gray">
                        {blog.readingTimeMinutes} min read
                      </div>
                    </motion.a>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-neutral-gray">No blogs published yet</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
