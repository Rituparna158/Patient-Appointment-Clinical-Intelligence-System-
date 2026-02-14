import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../src/app';
import { HTTP_STATUS } from '../src/constants/http-status';

describe('Auth serice-Register', () => {
  it('should register a new uder successfully', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(HTTP_STATUS.CREATED);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.user).not.toHaveProperty('password');
  });
  it('should return 409 if email already exists', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'dup@test.com',
      password: 'password123',
    });
    const res = await request(app).post('/api/auth/register').send({
      email: 'dup@test.com',
      password: 'password123',
    });
    expect(res.status).toBe(HTTP_STATUS.CONFLICT);
  });
  it('should return 400 if email is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      password: 'password123',
    });
    expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
  });
});
