import { Request, Response, NextFunction } from 'express';
import * as appointmentService from '../services/appointment.service';
import { AppointmentStatus, PaymentStatus } from '../types/appointment.types';
import { success } from 'zod';

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  UNAUTHORIZED: 401,
};

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
    console.log('Book request body:', req.body);
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
      //   card_number,
      //   CVV_number,
      //   paymentStatus,
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

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await appointmentService.adminSearchAppointments({
      branchId,
      status,
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
