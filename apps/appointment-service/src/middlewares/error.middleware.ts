import { ErrorRequestHandler } from 'express';
import { AppError } from '@repo/shared-error';
import { HTTP_STATUS } from '../constants/http_status';
import { logger } from '@repo/shared-utils';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error('FULL error:', err);
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res
    .status(HTTP_STATUS.INTERNAL_ERROR)
    .json({ message: 'Internal server error' });
};
