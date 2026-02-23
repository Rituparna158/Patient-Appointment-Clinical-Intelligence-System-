import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from '../src/app';
import { HTTP_STATUS } from '../src/constants/http-status';
import * as models from '../src/models';

vi.mock('../src/models');

describe('Auth - Register (Mocked)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should register successfully (happy path)', async () => {
    vi.spyOn(models.User, 'findOne').mockResolvedValue(null as any);

    vi.spyOn(models.User, 'create').mockResolvedValue({
      id: 1,
      email: 'test@gmail.com',
      full_name: 'Test User',
    } as any);

    const res = await request(app).post('/api/auth/register').send({
      full_name: 'Test User',
      email: 'test@gmail.com',
      password: 'Password@123',
    });

    expect(res.status).toBe(HTTP_STATUS.CREATED);
    expect(res.body).toHaveProperty('user');
  });

  it('should return 409 if email exists', async () => {
    vi.spyOn(models.User, 'findOne').mockResolvedValue({ id: 1 } as any);

    const res = await request(app).post('/api/auth/register').send({
      full_name: 'Test',
      email: 'dup@gmail.com',
      password: 'Password@123',
    });

    expect(res.status).toBe(HTTP_STATUS.CONFLICT);
  });
});
