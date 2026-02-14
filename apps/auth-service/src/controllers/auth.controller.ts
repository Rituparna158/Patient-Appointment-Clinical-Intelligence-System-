import { registerUser, loginUser } from '../services/auth.service';
import { HTTP_STATUS } from '../constants/http-status';
import { MESSAGES } from '../constants/messages';
import { RegisterDTO } from '../types/auth.types';
import { RequestHandler } from 'express';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { z } from 'zod';
import { error } from 'node:console';

const register: RequestHandler = async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);

    const user = await registerUser(body);

    return res.status(HTTP_STATUS.CREATED).json({
      message: MESSAGES.REGISTER_SUCCESS,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login: RequestHandler = async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);

    const result = await loginUser(body);

    return res.status(HTTP_STATUS.OK).json({
      token: result.token,
    });
  } catch (err) {
    next(err);
  }
};

const me: RequestHandler = async (req, res) => {
  return res.status(HTTP_STATUS.OK).json({
    ...(req as any).user,
  });
};
export { register, login, me };
