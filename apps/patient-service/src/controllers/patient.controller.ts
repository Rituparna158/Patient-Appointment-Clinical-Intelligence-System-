import { Request, Response, NextFunction } from 'express';
import * as service from '../services/patient.service';
import { HTTP_STATUS } from '../constants/http_status';
import { MESSAGES } from '../constants/messages';

const createProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'Unauthorized',
      });
    }

    const patient = await service.createProfile(req.user.userId, req.body);

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'Unauthorized',
      });
    }

    const patient = await service.getProfile(req.user.userId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'Unauthorized',
      });
    }

    const updatedPatient = await service.updateProfile(
      req.user.userId,
      req.body
    );

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: updatedPatient,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'Unauthorized',
      });
    }

    await service.deleteProfile(req.user.userId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.PROFILE_DELETED,
    });
  } catch (error) {
    next(error);
  }
};

const adminSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'Unauthorized',
      });
    }

    const query = req.query;

    console.log('QUERY:', query);

    const search = typeof query.search === 'string' ? query.search : undefined;

    const page =
      typeof query.page === 'number' ? query.page : Number(query.page);

    const limit =
      typeof query.limit === 'number' ? query.limit : Number(query.page);

    const result = await service.adminSearchPatients({
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

export { createProfile, getProfile, updateProfile, deleteProfile, adminSearch };
