import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { HTTP_STATUS } from '../constants/http-status';
import { AppError } from '../utils/app-error';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: 'Validation Error',
      details: err.issues.map((e) => ({
        field: e.path[0],
        message: e.message,
      })),
    });
  }
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.message,
    });
  }
  return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
    error: 'Something went worng',
  });
};
export { errorHandler };
