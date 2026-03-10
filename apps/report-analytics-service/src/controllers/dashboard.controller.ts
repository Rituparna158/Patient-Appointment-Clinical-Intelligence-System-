import { Request, Response, NextFunction } from 'express';
import * as service from '../services/dashboard.service';
import { success } from 'zod';

export const getCounters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await service.getDashboardCounters();

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAppointmentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await service.getAppointmentStatus();

    return res.json({
      success: true,
      data,
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
    const { days } = req.validateQuery;

    const trendDays = days ?? 7;
    const result = await service.getAppointmentTrend(trendDays);
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
    const { page, limit, from, to, sortBy, sortOrder } = req.validateQuery;

    const result = await service.getDailyAnalytics(
      page,
      limit,
      from,
      to,
      sortBy,
      sortOrder
    );

    return res.json({
      success: true,
      total: result.count,
      rows: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const doctorDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doctorId = req.user?.userId;

    if (!doctorId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const data = await service.getDoctorDashboard(doctorId);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const patientDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patientId = req.user?.userId;

    if (!patientId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const data = await service.getPatientDashboard(patientId);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
