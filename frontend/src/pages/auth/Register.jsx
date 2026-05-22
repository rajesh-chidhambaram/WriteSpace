import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { authService } from '../../services/services.js';
import { useAuthStore } from '../../context/store.js';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      setUser(response.data.data.user);
      setToken(response.data.data.token);
      toast.success('Registration successful! Welcome to WriteSpace!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Register - WriteSpace</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-cream p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md card p-8"
        >
          <h1 className="text-3xl font-bold text-dark-gray text-center mb-2 font-display">
            Join WriteSpace
          </h1>
          <p className="text-center text-neutral-gray mb-8">
            Start sharing your stories today
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-dark-gray mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-base"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-dark-gray mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-base"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-dark-gray mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-base"
                placeholder="johndoe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-gray mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-base"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-gray mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-base"
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-neutral-gray mt-1">
                At least 6 characters with uppercase and number
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-gray mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-base"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-gray">
              Already have an account?{' '}
              <Link to="/login" className="text-sage-green font-medium hover:opacity-80">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
