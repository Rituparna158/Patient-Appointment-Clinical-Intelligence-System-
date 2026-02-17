import type { RequestHandler } from 'express';
import { HTTP_STATUS } from '../constants/http-status';
import { Role } from '../types/auth.types';
const reuireRole = (role: string): RequestHandler => {
  return (req, res, next) => {
    const user = (req as any).user;

    if (!user || !user.roles) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        error: 'Access Denied(No roles found)',
      });
    }
    if (!user.roles.includes(role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        error: 'Access denied',
      });
    }
    next();
  };
};
const requireAnyRole = (roles: Role[]): RequestHandler => {
  return (req, res, next) => {
    const user = (req as any).user;

    if (!user || !user.roles) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        error: 'Access denied(No roles found)',
      });
    }
    const allowed = roles.some((r) => user.roles.includes(r));

    if (!allowed) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        error: 'Access denied',
      });
    }
    next();
  };
};
export { reuireRole, requireAnyRole };
