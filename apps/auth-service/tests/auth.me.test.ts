import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import app from '../src/app';
import jwt from 'jsonwebtoken';
import * as models from '../src/models';
import { HTTP_STATUS } from '../src/constants/http-status';

vi.mock('jsonwebtoken');
vi.mock('../src/models');

describe('Auth - /me (Mocked)', () => {
  it('should return 401 if no token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
  });

  it('should return user if token valid', async () => {
    vi.mocked(jwt.verify).mockReturnValue({ id: 1 } as never);

    vi.mocked(models.User.findByPk).mockResolvedValue({
      id: 1,
      email: 'me@gmail.com',
    } as any);

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer validtoken');

    expect(res.status).toBe(HTTP_STATUS.OK);
    expect(res.body.email).toBe('me@gmail.com');
  });
});
