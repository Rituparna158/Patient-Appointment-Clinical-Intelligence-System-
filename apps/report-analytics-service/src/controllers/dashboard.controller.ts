import { Request, Response, NextFunction } from 'express';
import * as service from '../services/dashboard.service';
import { Doctor } from '@repo/shared-database';
import { Patient } from '@repo/shared-database';
import { RangeType } from '../types/dashboard.types';

export const getCounters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { range } = req.query as {
      range?: 'today' | 'week' | 'month' | 'year';
    };

    const result = await service.getDashboardCounters(range);

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
    const { range } = req.query as {
      range?: 'today' | 'week' | 'month' | 'year';
    };

    const data = await service.getAppointmentStatus(range);

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
    const { range } = req.query as {
      range?: 'today' | 'week' | 'month' | 'year';
    };

    const result = await service.getAppointmentTrend(range);

    return res.json({
      success: true,
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
    const {
      page = 1,
      limit = 10,
      from,
      to,
      sortBy,
      sortOrder,
      range,
    } = req.query as any;

    const result = await service.getDailyAnalytics(
      Number(page),
      Number(limit),
      { from, to, sortBy, sortOrder, range }
    );

    return res.json({
      success: true,
      total: result.total,
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
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const doctor = await Doctor.findOne({
      where: { userId },
    });

    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor not found',
      });
    }

    const data = await service.getDoctorDashboard(doctor.id);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const doctorAppointmentsTable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const doctor = await Doctor.findOne({
      where: { userId },
    });

    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor not found',
      });
    }

    const doctorId = doctor.id;

    const {
      page = 1,
      limit = 10,
      from,
      to,
      sortBy,
      sortOrder,
    } = req.query as any;

    const result = await service.getDoctorAppointments(
      doctorId,
      Number(page),
      Number(limit),
      from,
      to,
      sortBy,
      sortOrder
    );

    return res.json({
      success: true,
      total: result.total,
      rows: result.rows,
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
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const patient = await Patient.findOne({
      where: { userId },
    });

    if (!patient) {
      return res.status(404).json({
        message: 'Doctor not found',
      });
    }

    const patientId = patient.id;
    const data = await service.getPatientDashboard(patientId);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const patientAppointmentsTable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const patient = await Patient.findOne({
      where: { userId },
    });

    if (!patient) {
      return res.status(404).json({
        message: 'Doctor not found',
      });
    }

    const patientId = patient.id;

    const {
      page = 1,
      limit = 10,
      from,
      to,
      sortBy,
      sortOrder,
    } = req.query as any;

    const result = await service.getPatientAppointments(
      patientId,
      Number(page),
      Number(limit),
      from,
      to,
      sortBy,
      sortOrder
    );

    return res.json({
      success: true,
      total: result.total,
      rows: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

const getDoctorId = async (userId: string) => {
  const doctor = await Doctor.findOne({
    where: { userId },
  });

  if (!doctor) {
    throw new Error('Doctor not found');
  }

  return doctor.id;
};

export const doctorWorkloadTrend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { range } = req.query as { range?: RangeType };

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const doctorId = await getDoctorId(userId);

    const data = await service.getDoctorWorkloadTrend(doctorId, range);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/* -------- COMPLETION RATE -------- */

export const doctorCompletionRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { range } = req.query as { range?: RangeType };

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const doctorId = await getDoctorId(userId);

    const data = await service.getDoctorCompletionRate(doctorId, range);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const doctorPatientTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { range } = req.query as { range?: RangeType };

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const doctorId = await getDoctorId(userId);

    const data = await service.getDoctorPatientTypes(doctorId, range);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
