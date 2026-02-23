import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import app from '../src/app';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../src/constants/http-status';

vi.mock('jsonwebtoken');

describe('Auth - Refresh Token (Mocked)', () => {
  it('should generate new access token', async () => {
    vi.mocked(jwt.verify).mockReturnValue({ id: 1 } as never);
    vi.mocked(jwt.sign).mockReturnValue('newAccessToken' as never);

    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'validToken' });

    expect(res.status).toBe(HTTP_STATUS.OK);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('should return 401 if invalid token', async () => {
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error('Invalid');
    });

    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'invalid' });

    expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
  });
});
