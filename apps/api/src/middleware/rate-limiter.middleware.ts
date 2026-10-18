import rateLimit from 'express-rate-limit';

// Global API rate limiter: 120 requests per minute
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again in a moment.' },
});

// Checkout rate limiter: 15 checkouts per 5 minutes per IP
export const checkoutRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many checkout attempts. Please wait before creating another order.' },
});

// Admin login rate limiter: 6 attempts per 15 minutes per IP
export const adminLoginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many failed login attempts. Security lock engaged for 15 minutes.' },
});

// Support ticket rate limiter: 5 tickets per hour per IP
export const supportRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many support tickets submitted. Please wait before submitting another.' },
});
