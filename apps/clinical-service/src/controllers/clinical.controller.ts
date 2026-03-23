import { Request, Response, NextFunction } from 'express';
import * as clinicalService from '../services/clinical.service';
import { HTTP_STATUS } from '@repo/shared-constants';

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

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateConsultationNote = async (
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

    //const user = req.user!;

    const noteId = req.params.noteId;

    if (!noteId || Array.isArray(noteId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note id',
      });
    }

    const updatedNote = await clinicalService.updateNote(
      noteId,
      req.user.userId,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

export const getNotesByAppointment = async (
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

    const user = req.user!;

    const appointmentId = req.params.appointmentId;

    if (!appointmentId || Array.isArray(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment id',
      });
    }

    const result = await clinicalService.getNotesByAppointment(
      appointmentId,
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctorConsultations = async (
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

    const { page, limit, search, from, to, sortBy, sortOrder } =
      req.validateQuery;

    const result = await clinicalService.getDoctorConsultations({
      doctorUserId: req.user.userId,
      page,
      limit,
      search,
      from,
      to,
      sortBy,
      sortOrder,
    });

    return res.status(200).json({
      success: true,
      total: result.count,
      page,
      limit,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getPatientTimeline = async (
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

    const { page, limit, from, to, search, sortBy, sortOrder } =
      req.validateQuery;

    const result = await clinicalService.getPatientTimeline({
      userId: req.user.userId,
      page,
      limit,
      from,
      to,
      search,
      sortBy,
      sortOrder,
    });

    return res.status(200).json({
      success: true,
      total: result.count,
      page,
      limit,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllClinicalRecords = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, search, from, to, sortBy, sortOrder } =
      req.validateQuery;

    const result = await clinicalService.getAllRecords({
      page,
      limit,
      search,
      from,
      to,
      sortBy,
      sortOrder,
    });

    return res.status(200).json({
      success: true,
      total: result.count,
      page,
      limit,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getPatientProfileForDoctor = async (
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

    const patientId = req.params.patientId;

    if (!patientId || Array.isArray(patientId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient id',
      });
    }

    const result = await clinicalService.getPatientProfileForDoctor(
      userId,
      patientId
    );

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
