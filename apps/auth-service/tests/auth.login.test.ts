import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../src/app';
import { HTTP_STATUS } from '../src/constants/http-status';
import { response } from 'express';

describe('Auth serice-Login', () => {
  it('should login successfully and return token', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'logint@test.com',
      password: 'password123',
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'logint@test.com',
      password: 'password123',
    });
    expect(res.status).toBe(HTTP_STATUS.OK);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });
  it('should return 401 if password is incorrect', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'wrongpass@test.com',
      password: 'password123',
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'wrongpass@test.com',
      password: 'wrongpassword',
    });
    expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
  });
  it('should return 404 if user does not exist', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nouser@test.com',
      password: 'password123',
    });
    expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
  });
  (it('should return 400 if email is missing'),
    async () => {
      const res = await request(app).post('/api/auth/login').send({
        password: 'password123',
      });
      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
    });
});
