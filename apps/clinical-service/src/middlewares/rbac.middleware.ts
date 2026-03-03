import { Request, Response, NextFunction } from 'express';
//import { JWTPayload } from "../types/auth.types";
import * as rbacRepo from '../repositories/rbac.repository';
import { MESSAGES } from '../constants/messages';
import { JwtPayload } from 'jsonwebtoken';
import { HTTP_STATUS } from '../constants/http_status';

export const authorizeRole = (roleName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const userRole = await rbacRepo.getUserRole(req.user.userId);
    if (!userRole)
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: MESSAGES.FORBIDDEN });

    const role = await rbacRepo.getRole(userRole.roleId);
    if (!role || role.name !== roleName)
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: MESSAGES.FORBIDDEN });

    next();
  };
};

export const authorizePermission = (permissionName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const userRole = await rbacRepo.getUserRole(req.user?.userId);
    if (!userRole)
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: MESSAGES.FORBIDDEN });

    const permissions = await rbacRepo.getPermissionsByRole(userRole.roleId);
    const hasPermission = permissions.some((p) => p.name === permissionName);

    if (!hasPermission)
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: MESSAGES.PERMISSION_DENIED });

    next();
  };
};
