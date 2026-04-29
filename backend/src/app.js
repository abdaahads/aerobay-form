import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';

import formRoutes from './routes/forms.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';

const app = express();

// Basic Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiting for form submissions
const formLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes by default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 20, // Limit each IP to 20 submissions per window
  message: { success: false, message: 'Too many submissions from this IP, please try again later' }
});

// Routes
app.use('/api/forms/submit', formLimiter); // Apply rate limiter only to form submissions
app.use('/api/forms', formRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'EXPRESS_ENDPOINT_NOT_FOUND', url: req.url, originalUrl: req.originalUrl });
});

// Global Error Handler
app.use(errorHandler);

export default app;
