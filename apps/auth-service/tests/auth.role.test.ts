import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from '../src/app';
import { HTTP_STATUS } from '../src/constants/http-status';
import * as models from '../src/models';

vi.mock('../src/models');

describe('Auth - Role Middleware (Mocked)', () => {
  it('should block if role not doctor', async () => {
    const jwt = await import('jsonwebtoken');
    vi.spyOn(jwt, 'verify').mockReturnValue({ id: 1 } as never);

    vi.spyOn(models.UserRole, 'findOne').mockResolvedValue(null as any);

    const res = await request(app)
      .get('/api/auth/doctor-only')
      .set('Authorization', 'Bearer validtoken');

    expect(res.status).toBe(HTTP_STATUS.FORBIDDEN);
  });

  it('should allow if role doctor', async () => {
    const jwt = await import('jsonwebtoken');
    vi.spyOn(jwt, 'verify').mockReturnValue({ id: 1 } as never);

    vi.spyOn(models.UserRole, 'findOne').mockResolvedValue({
      roleId: 2,
    } as any);

    const res = await request(app)
      .get('/api/auth/doctor-only')
      .set('Authorization', 'Bearer validtoken');

    expect(res.status).toBe(HTTP_STATUS.OK);
  });
});
