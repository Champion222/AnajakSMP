import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env.js';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('[Unhandled Error]', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'An internal server error occurred';

  res.status(status).json({
    error: message,
    ...(ENV.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
