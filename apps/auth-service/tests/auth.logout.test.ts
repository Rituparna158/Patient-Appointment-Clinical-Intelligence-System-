import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../src/app';
import { HTTP_STATUS } from '../src/constants/http-status';

describe('Auth Service - Logout', () => {
  it('should logout successfully', async () => {
    const res = await request(app).post('/api/auth/logout');

    expect(res.status).toBe(HTTP_STATUS.OK);
    expect(res.body.message).toContain('Logged out successfully');
  });
});
