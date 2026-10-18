import { Request, Response, NextFunction } from 'express';
import { AdminAuthService, AdminAuthTokenPayload } from '../services/admin-auth.service.js';
import { AdminRole } from '@anajaksmp/shared';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      admin?: AdminAuthTokenPayload;
    }
  }
}

export const requireAdminAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = AdminAuthService.verifyToken(token);

  if (!payload) {
    res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
    return;
  }

  req.admin = payload;
  next();
};

export const requireRole = (allowedRoles: AdminRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!allowedRoles.includes(req.admin.role)) {
      res.status(403).json({
        error: `Forbidden: Required permission level (${allowedRoles.join(', ')}). Your role is ${req.admin.role}`,
      });
      return;
    }

    next();
  };
};
