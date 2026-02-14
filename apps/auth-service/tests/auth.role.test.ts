import request from 'supertest';
import { beforeEach, describe, it, expect } from 'vitest';
import app from '../src/app';
import { clearUsers, makeUserDoctor } from '../src/repositories/user.repo';
import { HTTP_STATUS } from '../src/constants/http-status';

describe('Auth Service - Role Middleware', () => {
  beforeEach(() => {
    clearUsers();
  });
  it('should block access if role is not doctor', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'patient@test.com',
      password: 'password123',
    });

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'patient@test.com',
      password: 'password123',
    });
    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/auth/doctor-only')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(HTTP_STATUS.FORBIDDEN);
  });
  it('should allow access if role is doctor', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'doctor@test.com',
      password: 'password123',
    });
    makeUserDoctor('doctor@test.com');

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'doctor@test.com',
      password: 'password123',
    });
    const token = loginRes.body.token;
    const res = await request(app)
      .get('/api/auth/doctor-only')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(HTTP_STATUS.OK);
  });
});
