import { registerUser, loginUser } from '../services/auth.service';
import { HTTP_STATUS } from '../constants/http-status';
import { MESSAGES } from '../constants/messages';
import { RegisterDTO } from '../types/auth.types';
import { RequestHandler } from 'express';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { z } from 'zod';
import { error } from 'node:console';

const register: RequestHandler = async (req, res) => {
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
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Invalid input',
        details: err.issues,
      });
    }
    if (err.message === MESSAGES.EMAIL_ALREADY_EXISTS) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        error: err.message,
      });
    }
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      error: 'Something went wrong',
    });
  }
};
const login: RequestHandler = async (req, res) => {
  try {
    const body = loginSchema.parse(req.body);

    const result = await loginUser(body);

    return res.status(HTTP_STATUS.OK).json({
      token: result.token,
    });
  } catch (err: any) {
    if (err.message === MESSAGES.USER_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        error: err.message,
      });
    }
    if (err.message === MESSAGES.INVALID_CREDENTIALS) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: err.message,
      });
    }
    if (err instanceof z.ZodError) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Invalid input',
        details: err.issues,
      });
    }
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: 'Login failed',
    });
  }
};
const me: RequestHandler = async (req, res) => {
  return res.status(HTTP_STATUS.OK).json({
    ...(req as any).user,
  });
};
export { register, login, me };
