import { Request, Response, NextFunction } from 'express';
import * as appointmentService from '../services/appointment.service';
import { AppointmentStatus, PaymentStatus } from '../types/appointment.types';
import { HTTP_STATUS } from '../constants/http_status';

const extractParam = (
  param: string | string[] | undefined,
  fieldname: string
): string => {
  if (!param || Array.isArray(param)) {
    throw new Error(`Invalid ${fieldname}`);
  }
  return param;
};

export const bookAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const { doctorId, branchId, slotId, appointmentReason } = req.body;

    const appointment = await appointmentService.bookAppointment({
      userId,
      doctorId,
      branchId,
      slotId,
      appointmentReason,
    });

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const changeAppointmentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentId = extractParam(req.params.id, 'appointment id');
    const { status } = req.body as { status: AppointmentStatus };

    const result = await appointmentService.changeAppointmentStatus({
      appointmentId,
      status,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const confirmPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { appointmentId, paymentStatus } = req.body as {
      appointmentId: string;
      paymentStatus: PaymentStatus;
    };

    const result = await appointmentService.confirmPayment({
      appointmentId,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await appointmentService.getPatientAppointments({
      userId,
      page,
      limit,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctorAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await appointmentService.getDoctorAppointmentsByUser({
      userId,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const adminSearchAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const branchId = req.query.branchId as string | undefined;
    const status = req.query.status as AppointmentStatus | undefined;
    const search = req.query.search as string | undefined;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await appointmentService.adminSearchAppointments({
      branchId,
      status,
      search,
      page,
      limit,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailableSlots = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doctorId = req.query.doctorId as string;
    const date = req.query.date as string;

    const result = await appointmentService.getAvailableSlots({
      doctorId,
      date,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { doctorId, branchId, startTime, endTime } = req.body;

    const slot = await appointmentService.createSlot({
      doctorId,
      branchId,
      startTime,
      endTime,
    });

    return res.status(201).json({
      success: true,
      data: slot,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDoctors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doctors = await appointmentService.getAllDoctors();

    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

export const createBranch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const branch = await appointmentService.createBranch(req.body);

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: branch,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBranches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const branches = await appointmentService.getAllBranches();

    res.status(200).json({
      success: true,
      data: branches,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelWithRefund = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentId = req.params.id;

    if (!appointmentId || Array.isArray(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment id',
      });
    }

    const result =
      await appointmentService.cancelAppointmentWithRefund(appointmentId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const reschedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentId = req.params.id;

    if (!appointmentId || Array.isArray(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment id',
      });
    }

    const { newSlotId } = req.body as { newSlotId?: string };

    if (!newSlotId) {
      return res.status(400).json({
        success: false,
        message: 'newSlotId is required',
      });
    }

    const result = await appointmentService.rescheduleAppointment(
      appointmentId,
      newSlotId
    );

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
