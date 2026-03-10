import { Request, Response, NextFunction } from 'express';
import * as service from '../services/export.service';

export const exportAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const type = req.query.type as 'daily' | 'monthly';
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    const delivery = req.query.delivery as 'download' | 'email';
    const userId = req.user?.userId;
    const email = req.user?.email;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const result = await service.requestExport(
      type,
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
  } catch (error) {
    next(error);
  }
};
