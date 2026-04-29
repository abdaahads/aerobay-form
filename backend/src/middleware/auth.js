import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logger.warn('Invalid JWT token attempt', { error: err.message });
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}
