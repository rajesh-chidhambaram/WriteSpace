import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { authService } from '../../services/services.js';
import { useAuthStore } from '../../context/store.js';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await authService.login(formData);
      setUser(response.data.data.user);
      setToken(response.data.data.token);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - WriteSpace</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-cream p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md card p-8"
        >
          <h1 className="text-3xl font-bold text-dark-gray text-center mb-2 font-display">
            Welcome Back
          </h1>
          <p className="text-center text-neutral-gray mb-8">
            Sign in to your WriteSpace account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
            </div>

            <Link
              to="/forgot-password"
              className="text-sm text-sage-green hover:text-opacity-80 transition-colors"
            >
              Forgot password?
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-gray">
              Don't have an account?{' '}
              <Link to="/register" className="text-sage-green font-medium hover:opacity-80">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
