import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import * as controller from '../src/controllers/notification.controller';
import * as notificationService from '../src/services/notification.service';

interface RequestWithUser extends Request {
  user?: {
    userId: string;
  };
}

function createMockResponse(): Response {
  const res = {} as Response;

  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);

  return res;
}

describe('notification.controller', () => {
  it('should return notifications successfully (happy case)', async () => {
    const req = {} as RequestWithUser;
    req.user = { userId: 'user1' };
    req.query = { page: '1', limit: '10' };

    const res = createMockResponse();
    const next: NextFunction = vi.fn();

    const mockResult = {
      total: 1,
      page: 1,
      limit: 10,
      notifications: [],
    };

    vi.spyOn(notificationService, 'getMyNotifications').mockResolvedValue(
      mockResult
    );

    await controller.getMyNotifications(req, res, next);

    expect(notificationService.getMyNotifications).toHaveBeenCalledWith(
      'user1',
      1,
      10
    );

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should return unauthorized if user missing (failed case)', async () => {
    const req = {} as RequestWithUser;
    req.query = {};

    const res = createMockResponse();
    const next: NextFunction = vi.fn();

    await controller.getMyNotifications(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should call error middleware when service fails (failed case)', async () => {
    const req = {} as RequestWithUser;
    req.user = { userId: 'user1' };
    req.query = {};

    const res = createMockResponse();
    const next: NextFunction = vi.fn();

    vi.spyOn(notificationService, 'getMyNotifications').mockRejectedValue(
      new Error('Service error')
    );

    await controller.getMyNotifications(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
