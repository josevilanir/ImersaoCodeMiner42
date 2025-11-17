import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../shared/errors/AppError';

export function ensureHostMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
  }

  if (req.user.role !== 'HOST') {
    throw new AppError('Only host can perform this action', 403, 'FORBIDDEN');
  }

  return next();
}