import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      res.status(400).json({
        error: 'Validation failed',
        issues,
      });
      return;
    }
    req.body = result.data;
    next();
  };
};
