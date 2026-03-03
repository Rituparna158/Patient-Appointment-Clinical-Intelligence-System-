import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';
import { HTTP_STATUS } from '../constants/http_status';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('FULL error:', err);
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res
    .status(HTTP_STATUS.INTERNAL_ERROR)
    .json({ message: 'Internal server error' });
};
