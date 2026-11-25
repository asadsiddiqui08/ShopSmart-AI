import rateLimit from 'express-rate-limit';

// Rate limiter for general API endpoints: 15 minutes, 300 requests
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

// Strict rate limiter for AI endpoints: 1 minute, 30 requests
export const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI request limit reached. Please wait a moment before sending another request.'
  }
});

// Auth endpoints rate limiter: 15 minutes, 20 attempts
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again in 15 minutes.'
  }
});
