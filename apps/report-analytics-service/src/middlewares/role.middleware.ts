import type { RequestHandler } from 'express';
import { HTTP_STATUS } from '../constants/http_status';

const requireRole = (role: string): RequestHandler => {
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

const requireAnyRole = (roles: string[]): RequestHandler => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.roles) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        error: 'Access denied(No roles found)',
      });
    }
    const allowed = roles.some((r: any) => user.roles?.includes(r));

    if (!allowed) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        error: 'Access denied(Role not allowed)',
      });
    }
    next();
  };
};
export { requireRole, requireAnyRole };
