import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { authService } from '../../services/services.js';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Check your email for password reset link');
    } catch (error) {
      toast.error('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - WriteSpace</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-cream p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md card p-8"
        >
          {!sent ? (
            <>
              <h1 className="text-3xl font-bold text-dark-gray text-center mb-2 font-display">
                Reset Password
              </h1>
              <p className="text-center text-neutral-gray mb-8">
                Enter your email address and we'll send you a link to reset your password
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-dark-gray mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-base"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="text-5xl mb-4">✓</div>
              <h1 className="text-2xl font-bold text-dark-gray mb-2 font-display">Check Your Email</h1>
              <p className="text-neutral-gray mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-neutral-gray">
                The link will expire in 1 hour. If you don't see the email, check your spam folder.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
