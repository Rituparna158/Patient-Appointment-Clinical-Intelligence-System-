import { registerUser, loginUser,refreshTokenService } from '../services/auth.service';
import { HTTP_STATUS } from '../constants/http-status';
import { MESSAGES } from '../constants/messages';
import { redis } from '../config/redis';
import { trasport } from '../utils/mailer';
import otpGenerator from 'otp-generator';
import { hashPassword } from '../utils/hash';
import { Role, User } from '../models';

import { RegisterDTO } from '../types/auth.types';
import {
  verifyRefreshToken,
  generateRefreshToken,
  generateToken,
} from '../utils/jwt';
import { RequestHandler } from 'express';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { validateHeaderValue } from 'node:http';
import { deleteRefreshToken, getRefreshToken } from '../utils/token-store';
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

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(HTTP_STATUS.OK).json({
      message: 'Login successful',
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
};

const refreshTok: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const newAccessToken=await refreshTokenService(refreshToken)

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    return res.json({
      message: 'Access token refreshed successfully!',
    });

  } catch (err) {
    next(err)
  }
};

const logout: RequestHandler = async (req, res, next) => {
  const token = req.cookies?.refreshToken;

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  console.log('Refresh token:', token);

  if (!token) {
    return res.status(HTTP_STATUS.OK).json({
      message: 'Logged out successfully',
    });
  }
  try {
    const decode = verifyRefreshToken(token) as any;
    console.log('decode user:', decode);
    const deleted = await deleteRefreshToken(decode.id);
    console.log('refresh token deleted from redis:', deleted);
  } catch (err) {
    console.log('logout: refresh token already invalid');
  }
  return res.json({ message: 'logout successful' });
};

const me: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
 
    const user = await User.findByPk(userId, {
      attributes: [
        "id",
        "email",
        "full_name",
        "phone",
        "gender",
        "date_of_birth",
        "isActive",
      ],
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["name"],
        },
      ],
    });
 
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
 
    const userJson = user.toJSON() as any;
 
    return res.json({
      id: userJson.id,
      email: userJson.email,
      full_name: userJson.full_name,
      phone: userJson.phone,
      gender: userJson.gender,
      date_of_birth: userJson.date_of_birth,
      role:
        userJson.roles && userJson.roles.length > 0
          ? userJson.roles[0].name
          : "patient",
    });
  } catch (err) {
    next(err);
  }
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
    console.log("email:",email);
    console.log("otp:",otp);
    console.log("new pssword:",newPassword);
    if (!email || !otp || !newPassword) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Otp and newPassword are required',
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
  refreshTok,
  logout,
  me,
  forgotPassword,
  resetPassword,
};
