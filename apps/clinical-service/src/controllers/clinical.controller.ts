import { Request, Response, NextFunction } from 'express';
import * as clinicalService from '../services/clinical.service';
import { success } from 'zod';

export const createConsultationNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    const userId = req.user.userId;
    const result = await clinicalService.createNote(userId, req.body);

    console.log('Body:', req.body);
    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getNotes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointmentId = req.params.appointmentId;

    if (!appointmentId || Array.isArray(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment id',
      });
    }

    const result = await clinicalService.getNoteByAppointment(appointmentId);

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
