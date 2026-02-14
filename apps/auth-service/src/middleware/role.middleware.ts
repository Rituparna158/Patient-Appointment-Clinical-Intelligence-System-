import type { RequestHandler } from 'express';
import { HTTP_STATUS } from '../constants/http-status';
import { Role } from '../types/auth.types';
const reuireRole = (role: string): RequestHandler => {
  return (req, res, next) => {
    const user = (req as any).user;

    if (!user || user.role !== role) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        error: 'Access Denied',
      });
    }
    next();
  };
};
const requireAnyRole = (roles: Role[]): RequestHandler => {
  return (req, res, next) => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        error: 'Access denied',
      });
    }
    next();
  };
};
export { reuireRole, requireAnyRole };
