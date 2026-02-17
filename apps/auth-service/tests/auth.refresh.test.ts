import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';

import app from '../src/app';
import { HTTP_STATUS } from '../src/constants/http-status';
import { User } from '../src/models';

describe('Auth Service-Refresh Token', () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
  });
  it('should generate a new access token with valid refresh token', async () => {
    await request(app).post('/api/auth/register').send({
      full_name: 'Refresh User',
      email: 'refresh@gmail.com',
      password: 'Password@123',
    });
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'refresh@gmail.com',
      password: 'Password@123',
    });
    expect(loginRes.status).toBe(HTTP_STATUS.OK);

    const refreshToken = loginRes.body.refreshToken;

    expect(refreshToken).toBeDefined();

    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(refreshRes.status).toBe(HTTP_STATUS.OK);

    expect(refreshRes.body).toHaveProperty('accessToken');
    expect(typeof refreshRes.body.accessToken).toBe('string');
  });
  it('should return 400 if refresh token is missing', async () => {
    const res = await request(app).post('/api/auth/refresh').send({});

    expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(res.body).toHaveProperty('error');
  });
  it('sould return 401 if refresh token is invalid', async () => {
    const res = await request(app).post('/api/auth/refresh').send({
      refreshToken: 'Invalid token value',
    });
    expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(res.body).toHaveProperty('error');
  });
});
