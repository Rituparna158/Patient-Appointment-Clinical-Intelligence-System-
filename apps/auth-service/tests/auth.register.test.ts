import request from 'supertest';
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import app from '../src/app';
import { HTTP_STATUS } from '../src/constants/http-status';
import { User } from '../src/models';

describe('Auth serice-Register', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send({
      full_name: 'Test User',
      email: 'test1@gmail.com',
      password: 'Password@123',
    });
    expect(res.status).toBe(HTTP_STATUS.CREATED);
    expect(res.body).toHaveProperty('user');
  });
  it('should return 409 if email already exists', async () => {
    await request(app).post('/api/auth/register').send({
      full_name: 'Test User',
      email: 'dup@gmail.com',
      password: 'Password@123',
    });
    const res = await request(app).post('/api/auth/register').send({
      full_name: 'Test User',
      email: 'dup@gmail.com',
      password: 'Password@123',
    });
    expect(res.status).toBe(HTTP_STATUS.CONFLICT);
  });
  it('should return 400 if email is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      full_name: 'Test User',
      password: 'Password@123',
    });
    expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
  });
});
