import { RequestHandler } from 'express';

export const requirePermission = (permission: string): RequestHandler => {
  return (req, res, next) => {
    const user = (req as any).user;
    console.log('user:', user);
    console.log('permissions', user.permissions);
    if (!user || !user.permissions) {
      return res.status(403).json({
        error: 'Access denied (no permission found)',
      });
    }
    if (!user.permissions.includes(permission)) {
      return res.status(403).json({
        error: 'Access denied (permission missing)',
      });
    }
    next();
  };
};
