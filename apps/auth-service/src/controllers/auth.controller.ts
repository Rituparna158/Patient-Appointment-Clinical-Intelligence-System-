import { registerUser, loginUser } from '../services/auth.service';
import { HTTP_STATUS } from '../constants/http-status';
import { MESSAGES } from '../constants/messages';
import { redis } from '../config/redis';
import { trasport } from '../utils/mailer';
import otpGenerator from 'otp-generator';
import { hashPassword } from '../utils/hash';
import { User } from '../models';
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
    return res.status(HTTP_STATUS.OK).json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      error: 'Invalid or expired refresh token',
    });
  }
};

const logout: RequestHandler = async (req, res) => {
  return res.status(HTTP_STATUS.OK).json({
    message: 'Logged out successfully (client must delete the tokens)',
  });
};
const me: RequestHandler = async (req, res) => {
  return res.status(HTTP_STATUS.OK).json({
    ...(req as any).user,
  });
};

const forgotPassword: RequestHandler = async (req, res, next) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({
        error: 'Email is required',
      });
    }

    const email = req.body.email.trim().toLowerCase();
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({
        message: 'If account exists,OTP has been sent',
      });
    }
    console.log('MAIL_USER:', process.env.MAIL_USER);
    console.log('MAIL_PASS exists:', !!process.env.MAIL_PASS);
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    await redis.set(`reset:${email}`, otp, 'EX', 600);
    try {
      await trasport.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Reset password OTP',
        text: `Your OTP for resetting password is: ${otp}.It expires in 10 minutes.`,
      });
      console.log('email sent successfully');
    } catch (error) {
      console.log('email sending failed', error);
    }

    return res.json({
      message: 'OTP sent successfully',
    });
  } catch (err) {
    next(err);
  }
};
const resetPassword: RequestHandler = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Email,otp and newPassword are required',
      });
    }
    const cleanEmail = req.body.email.trim().toLowerCase();
    console.log('looking for key:', `reset:${cleanEmail}`);

    const saveOtp = await redis.get(`reset:${cleanEmail}`);

    console.log('saved otp:', saveOtp);
    console.log('user otp:', otp);

    if (!saveOtp) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: ' OTP expired or not found',
      });
    }
    if (saveOtp !== otp) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'OTP invalid',
      });
    }
    const hashed = await hashPassword(newPassword);

    await User.update({ passwordHash: hashed }, { where: { email } });

    await redis.del(`reset:${cleanEmail}`);
    return res.json({
      message: 'Password reset successful',
    });
  } catch (err) {
    next(err);
  }
};

export {
  register,
  login,
  refreshToken,
  logout,
  me,
  forgotPassword,
  resetPassword,
};
