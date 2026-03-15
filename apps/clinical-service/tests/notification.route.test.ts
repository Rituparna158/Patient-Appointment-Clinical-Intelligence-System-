import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import app from '../src/app';
import * as notificationService from '../src/services/notification.service';
import { Request, Response, NextFunction } from 'express';

interface RequestWithUser extends Request {
  user?: {
    userId: string;
  };
}

vi.mock('../src/middlewares/auth.middleware', () => ({
  authenticate: (req: RequestWithUser, res: Response, next: NextFunction) => {
    req.user = { userId: 'user1' };
    next();
  },
}));

describe('notification routes', () => {
  it('GET /api/clinical/notification/me', async () => {
    vi.spyOn(notificationService, 'getMyNotifications').mockResolvedValue({
      total: 0,
      page: 1,
      limit: 10,
      notifications: [],
    });

    const response = await request(app).get('/api/clinical/notification/me');

    expect(response.status).toBe(200);
  });
});
