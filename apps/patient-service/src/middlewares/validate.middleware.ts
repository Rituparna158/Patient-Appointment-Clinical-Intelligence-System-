import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';
import { HTTP_STATUS } from '../constants/http_status';

export const validateBody = <T>(schema: ZodType<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: error.issues[0].message,
        });
      }

      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Validation failed',
      });
    }
  };
};

export const validateQuery = <T>(schema: ZodType<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('incoming query:', req.query);
      const parsed = schema.parse(req.query);
      (req as any).validateQuery = parsed;
      //req.query = parsed as Request['query'];
      next();
    } catch (error) {
      console.log('validation error:', error);
      if (error instanceof ZodError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: error.issues[0].message,
        });
      }

      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Validation failed',
      });
    }
  };
};
