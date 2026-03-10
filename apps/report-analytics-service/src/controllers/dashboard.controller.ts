import { Request, Response, NextFunction } from 'express';
import * as service from '../services/dashboard.service';
import { success } from 'zod';

export const getCounters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await service.getCounters();

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAppointmentTrend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await service.getAppointmentTrend();
    return res.json({
      success,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getDailyAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit);
  } catch (error) {
    next(error);
  }
};
