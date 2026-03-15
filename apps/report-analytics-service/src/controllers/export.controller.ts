import { Request, Response, NextFunction } from 'express';
import * as service from '../services/export.service';
import { Doctor } from '../models/external/doctor.model';
import { AuthUser } from '../types/export.types';

type RangeType = 'today' | 'week' | 'month' | 'year';

type DeliveryType = 'download' | 'email';

export const exportAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { range, from, to, delivery } = req.query as {
      range?: RangeType;
      from?: string;
      to?: string;
      delivery?: DeliveryType;
    };

    const user = req.user as AuthUser | undefined;

    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const { userId, email, roles } = user;

    if (!delivery) {
      return res.status(400).json({
        message: 'Delivery type is required',
      });
    }

    if (roles.includes('admin')) {
      const result = await service.requestExport(
        range ?? 'today',
        from,
        to,
        delivery,
        userId,
        email
      );

      if ('filePath' in result) {
        return res.download(result.filePath as string);
      }

      return res.status(202).json({
        message: result.message,
      });
    }

    /*
    DOCTOR EXPORT
    */

    if (roles.includes('doctor')) {
      const doctor = await Doctor.findOne({
        where: { userId },
      });

      if (!doctor) {
        return res.status(404).json({
          message: 'Doctor not found',
        });
      }

      const result = await service.requestDoctorExport(
        doctor.id,
        delivery,
        email
      );

      if ('filePath' in result) {
        return res.download(result.filePath as string);
      }

      return res.status(202).json({
        message: result.message,
      });
    }

    return res.status(403).json({
      message: 'Export not allowed for this role',
    });
  } catch (error) {
    next(error);
  }
};
