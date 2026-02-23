import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  register,
  login,
  refreshTok,
  logout,
  me,
  forgotPassword,
  resetPassword,
} from '../../src/controllers/auth.controller';

import * as authService from '../../src/services/auth.service';
import { User } from '../../src/models';
import { redis } from '../../src/config/redis';
import { trasport } from '../../src/utils/mailer';
import { hashPassword } from '../../src/utils/hash';
import { verifyRefreshToken } from '../../src/utils/jwt';
import { deleteRefreshToken } from '../../src/utils/token-store';

vi.mock('../../src/services/auth.service');
vi.mock('../../src/models');
vi.mock('../../src/config/redis', () => ({
  redis: {
    set: vi.fn(),
    get: vi.fn(),
    del: vi.fn(),
  },
}));
vi.mock('../../src/utils/mailer', () => ({
  trasport: {
    sendMail: vi.fn(),
  },
}));
vi.mock('../../src/utils/hash');
vi.mock('../../src/utils/jwt');
vi.mock('../../src/utils/token-store');

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.cookie = vi.fn().mockReturnValue(res);
  res.clearCookie = vi.fn().mockReturnValue(res);
  return res;
};

describe('Auth Controller Unit Tests', () => {
  let next: any;

  beforeEach(() => {
    next = vi.fn();
    vi.clearAllMocks();
  });

  // ---------------- REGISTER ----------------
  it('register - success', async () => {
    const req: any = {
      body: {
        full_name: 'Rituparna Rath',
        email: 'rituparna@gmail.com',
        phone: '9876543210',
        gender: 'female',
        date_of_birth: new Date('2000-01-01'),
        password: 'Password1@',
      },
    };

    const res = mockRes();

    vi.mocked(authService.registerUser).mockResolvedValue({ id: 1 } as any);

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  // ---------------- LOGIN ----------------
  it('login - success', async () => {
    const req: any = {
      body: {
        email: 'rituparna@gmail.com',
        password: 'Password1@',
      },
    };

    const res = mockRes();

    vi.mocked(authService.loginUser).mockResolvedValue({
      accessToken: 'access',
      refreshToken: 'refresh',
      user: { id: 1 },
    } as any);

    await login(req, res, next);

    expect(res.cookie).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // ---------------- REFRESH ----------------
  it('refreshTok - success', async () => {
    const req: any = {
      cookies: { refreshToken: 'abc' },
    };

    const res = mockRes();

    vi.mocked(authService.refreshTokenService).mockResolvedValue('newAccess');

    await refreshTok(req, res, next);

    expect(res.cookie).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  // ---------------- LOGOUT ----------------
  it('logout - with token', async () => {
    const req: any = {
      cookies: { refreshToken: 'abc' },
    };

    const res = mockRes();

    vi.mocked(verifyRefreshToken).mockReturnValue({ id: 1 } as any);
    vi.mocked(deleteRefreshToken).mockResolvedValue(true as any);

    await logout(req, res, next);

    expect(res.clearCookie).toHaveBeenCalledTimes(2);
    expect(deleteRefreshToken).toHaveBeenCalled();
  });

  // ---------------- ME ----------------
  it('me - success', async () => {
    const req: any = { user: { id: 1 } };
    const res = mockRes();

    vi.mocked(User.findByPk).mockResolvedValue({
      toJSON: () => ({
        id: 1,
        email: 'rituparna@gmail.com',
        full_name: 'Rituparna Rath',
        phone: '9876543210',
        gender: 'female',
        date_of_birth: new Date('2000-01-01'),
        roles: [{ name: 'doctor' }],
      }),
    } as any);

    await me(req, res, next);

    expect(res.json).toHaveBeenCalled();
  });

  // ---------------- FORGOT PASSWORD ----------------
  it('forgotPassword - success', async () => {
    const req: any = {
      body: { email: 'rituparna@gmail.com' },
    };

    const res = mockRes();

    vi.mocked(User.findOne).mockResolvedValue({ id: 1 } as any);

    await forgotPassword(req, res, next);

    expect(redis.set).toHaveBeenCalled();
    expect(trasport.sendMail).toHaveBeenCalled();
  });

  // ---------------- RESET PASSWORD ----------------
  it('resetPassword - success', async () => {
    const req: any = {
      body: {
        email: 'rituparna@gmail.com',
        otp: '123456',
        newPassword: 'Password1@',
      },
    };

    const res = mockRes();

    vi.mocked(redis.get).mockResolvedValue('123456');
    vi.mocked(hashPassword).mockResolvedValue('hashedPassword');
    vi.mocked(User.update).mockResolvedValue([1] as any);

    await resetPassword(req, res, next);

    expect(User.update).toHaveBeenCalled();
    expect(redis.del).toHaveBeenCalled();
  });
});
