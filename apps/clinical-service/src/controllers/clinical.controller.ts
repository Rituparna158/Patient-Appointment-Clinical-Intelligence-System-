import { Request, Response, NextFunction } from 'express';
import * as clinicalService from '../services/clinical.service';

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

    const { page, limit, search, from, to } = (req as any).validateQuery;

    const result = await clinicalService.getDoctorConsultations(
      req.user.userId,
      search,
      from,
      to,
      page,
      limit
    );

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

    const { page, limit } = (req as any).validateQuery;

    const result = await clinicalService.getPatientTimeline(
      req.user.userId,
      page,
      limit
    );

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
    const { page, limit, search } = (req as any).validateQuery;

    const result = await clinicalService.getAllRecords(search, page, limit);

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
