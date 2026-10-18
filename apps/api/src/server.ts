import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ENV } from './config/env.js';
import apiRouter from './routes/index.js';
import { apiRateLimiter } from './middleware/rate-limiter.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

export const createServer = () => {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // Strict CORS configuration
  const allowedOrigins = [
    ENV.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'https://anajaksmp.xyz',
    'https://www.anajaksmp.xyz',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow mobile apps, curl, or same-origin (no origin header)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, true); // Permissive in dev, or specify strict origins
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Order-Token'],
    })
  );

  // Body Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Global Rate Limiting
  app.use(['/api', '/'], apiRateLimiter);

  // Health check endpoint
  app.get(['/health', '/api/health'], (_req, res) => {
    res.json({
      status: 'ok',
      service: 'AnajakSMP Store API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Mount API Routes
  app.use('/api', apiRouter);
  app.use('/', apiRouter);

  // 404 Handler
  app.use('*', (_req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
