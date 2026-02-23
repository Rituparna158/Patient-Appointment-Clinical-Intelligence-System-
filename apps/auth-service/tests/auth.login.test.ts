import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from '../src/app';
import { HTTP_STATUS } from '../src/constants/http-status';
import * as models from '../src/models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

vi.mock('../src/models');
vi.mock('bcrypt');
vi.mock('jsonwebtoken');

describe('Auth - Login (Mocked)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should login successfully', async () => {
    vi.mocked(models.User.findOne).mockResolvedValue({
      id: 1,
      email: 'login@gmail.com',
      password: 'hashed',
    } as any);

    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

    vi.mocked(jwt.sign).mockReturnValue('mockAccessToken' as never);

    const res = await request(app).post('/api/auth/login').send({
      email: 'login@gmail.com',
      password: 'Password@123',
    });

    expect(res.status).toBe(HTTP_STATUS.OK);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('should return 401 if password wrong', async () => {
    vi.mocked(models.User.findOne).mockResolvedValue({
      id: 1,
      password: 'hashed',
    } as any);

    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    const res = await request(app).post('/api/auth/login').send({
      email: 'login@gmail.com',
      password: 'wrong',
    });

    expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
  });

  it('should return 404 if user not found', async () => {
    vi.mocked(models.User.findOne).mockResolvedValue(null);

    const res = await request(app).post('/api/auth/login').send({
      email: 'nouser@gmail.com',
      password: '123',
    });

    expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
  });
});
