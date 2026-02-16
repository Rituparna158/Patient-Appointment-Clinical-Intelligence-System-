import { registerUser, loginUser } from '../services/auth.service';
import { HTTP_STATUS } from '../constants/http-status';
import { MESSAGES } from '../constants/messages';
import { RegisterDTO } from '../types/auth.types';
import {
  verifyRefreshToken,
  generateRefreshToken,
  generateToken,
} from '../utils/jwt';
import { RequestHandler } from 'express';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { validateHeaderValue } from 'node:http';
const register: RequestHandler = async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);

    const user = await registerUser(body);

    return res.status(HTTP_STATUS.CREATED).json({
      message: MESSAGES.REGISTER_SUCCESS,
      user,
    });
  } catch (err) {
    next(err);
  }
};

const login: RequestHandler = async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);

    const result = await loginUser(body);

    return res.status(HTTP_STATUS.OK).json(result);
  } catch (err) {
    next(err);
  }
};

const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Refresh Token is required',
      });
    }
    const decode = verifyRefreshToken(refreshToken) as any;

    const newAccessToken = generateToken({
      id: decode.id,
      email: decode.email,
    });
    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    return res.status(401).json({
      error: 'Invalid or expired refresh token',
    });
  }
};

const logout: RequestHandler = async (req, res) => {
  return res.status(200).json({
    message: 'Logged out successfully (client must delete the tokens)',
  });
};
const me: RequestHandler = async (req, res) => {
  return res.status(HTTP_STATUS.OK).json({
    ...(req as any).user,
  });
};
export { register, login, refreshToken, logout, me };
