import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../constants/http_status';

export interface JwtPayload {
  id: string;
  //userId: string;
}

// export interface AuthenticatedRequest extends Request {
//   user?: JwtPayload;
// }

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    (req.cookies?.accessToken as string | undefined) ||
    req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = {
      userId: decoded.id,
    };

    next();
  } catch {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: 'Invalid token' });
  }
};
