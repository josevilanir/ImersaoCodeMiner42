import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../shared/errors/AppError';
import { ZodError } from 'zod';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      data: null,
      error: {
        message: error.message,
        code: error.code,
      },
    });
  }

  if (error instanceof ZodError) {
    const firstError = error.issues[0];
    return res.status(400).json({
        data: null,
        error: {
        message: firstError?.message || 'Validation error',
        code: 'VALIDATION_ERROR',
        },
    });
  }

  console.error('Internal server error:', error);

  return res.status(500).json({
    data: null,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  });
}