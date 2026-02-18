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
        error: 'Access denied(Role missing)',
      });
    }
    next();
  };
};

const requireAnyRole = (role: String[]): RequestHandler => {
  return (req, res, next) => {
    const user = (req as any).user;

    if (!user || !user.roles) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        error: 'Access denied(No roles found)',
      });
    }
    const allowed = role.some((r: any) => user.roles.includes(r));

    if (!allowed) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        error: 'Access denied(Role not allowed)',
      });
    }
    next();
  };
};
export { reuireRole, requireAnyRole };
