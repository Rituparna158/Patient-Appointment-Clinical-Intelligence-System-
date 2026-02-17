import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt';
import { User } from '../models';
import { Role, Permission } from '../models';
import { HTTP_STATUS } from '../constants/http-status';

//const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: 'Token missing',
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('token:', token);
    const decode = verifyToken(token) as any;
    console.log('decode:', decode);

    const user = await User.findByPk(decode.id, {
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
          include: [
            {
              model: Permission,
              as: 'permissions',
              through: { attributes: [] },
            },
          ],
        },
      ],
    });
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: 'User not found',
      });
    }

    const roles = user.roles?.map((r) => r.name) || [];

    const permissions =
      user.roles?.flatMap(
        (role) => role.permissions?.map((p) => p.name) || []
      ) || [];

    (req as any).user = {
      id: user.id,
      email: user.email,
      roles,
      permissions,
    };
    next();
  } catch (err) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      error: 'Invalid Token',
    });
  }
};
export { requireAuth };
