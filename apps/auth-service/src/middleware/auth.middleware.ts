import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { HTTP_STATUS } from '../constants/http-status';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const requireAuth: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      error: 'Token missing',
    });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decode = jwt.verify(token, JWT_SECRET);
    (req as any).user = decode;
    next();
  } catch {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      error: 'Invalid token',
    });
  }
};
export { requireAuth };
