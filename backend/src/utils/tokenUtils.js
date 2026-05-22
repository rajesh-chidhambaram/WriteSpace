import jwt from 'jsonwebtoken';

/**
 * Generate JWT Token
 */
export const generateToken = (id, expiresIn = process.env.JWT_EXPIRE) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (id, expiresIn = process.env.REFRESH_TOKEN_EXPIRE) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn });
};

/**
 * Verify Token
 */
export const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

/**
 * Generate Password Reset Token
 */
export const generateResetToken = () => {
  return require('crypto').randomBytes(32).toString('hex');
};
