import request from 'supertest';
import { beforeEach, describe, it, expect } from 'vitest';
import app from '../src/app';
import { HTTP_STATUS } from '../src/constants/http-status';

describe('Auth service-Protected Route /me', () => {
  it('should return 401 if token is missing', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
  });
  it('should return user profile if token is valid', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'me@test.com',
      password: 'password23',
    });
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'me@test.com',
      password: 'password23',
    });
    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(HTTP_STATUS.OK);
    expect(res.body).toHaveProperty('email', 'me@test.com');
  });
});
