import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../src/app';
import { HTTP_STATUS } from '../src/constants/http-status';
import { response } from 'express';

describe('Auth service-Login', () => {
  it('should login successfully and return token', async () => {
    // try{
    //   const a = await request(app).post('/api/auth/register').send({
    //     full_name: 'Login User',
    //     email: 'logint@gmail.com',
    //     password: 'Password@123',
    //   });
    //   // console.log(a);
    // } catch {}
    const res = await request(app).post('/api/auth/login').send({
      email: 'logint@gmail.com',
      password: 'Password@123',
    });
    console.log(res);
    expect(res.status).toBe(HTTP_STATUS.OK);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  }, 15000);
  it('should return 401 if password is incorrect', async () => {
    await request(app).post('/api/auth/register').send({
      full_name: 'Wrong Pass',
      email: 'wrongpass@gmail.com',
      password: 'Password@123',
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'wrongpass@gmail.com',
      password: 'wrongpassword',
    });
    expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
  });
  it('should return 404 if user does not exist', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nouser@gmail.com',
      password: 'password123',
    });
    expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
  });
  it('should return 400 if email is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({
      password: 'Password@123',
    });
    expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
  });
});
