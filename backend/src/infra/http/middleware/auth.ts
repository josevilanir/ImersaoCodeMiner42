import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../../../shared/utils/jwt';
import { AppError } from '../../../shared/errors/AppError';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token not provided', 401, 'UNAUTHORIZED');
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    throw new AppError('Token not provided', 401, 'UNAUTHORIZED');
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    throw new AppError('Invalid token', 401, 'UNAUTHORIZED');
  }
}