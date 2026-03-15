import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';

vi.mock('../src/queues/appointment.producer', () => ({
  appointmentQueue: {
    add: vi.fn().mockResolvedValue(true),
  },
}));

vi.mock('../src/middlewares/auth.middleware', () => ({
  authenticate: (
    req: Request & { user?: { userId: string } },
    _res: Response,
    next: NextFunction
  ) => {
    req.user = { userId: 'user1' };
    next();
  },
}));

vi.mock('../src/middlewares/rbac.middleware', () => ({
  authorizeRole: () => (_req: Request, _res: Response, next: NextFunction) =>
    next(),

  authorizePermission:
    () => (_req: Request, _res: Response, next: NextFunction) =>
      next(),
}));

vi.mock('../src/controllers/appointment.controller', () => ({
  bookAppointment: async (_req: Request, res: Response) => {
    return res.status(201).json({
      success: true,
      data: { id: 'appointment1' },
    });
  },
}));

import router from '../src/routes/appointment.routes';

const app = express();
app.use(express.json());
app.use('/appointments', router);

describe('Appointment Routes', () => {
  it('POST /appointments/book success', async () => {
    const response = await request(app).post('/appointments/book').send({
      doctorId: '550e8400-e29b-41d4-a716-446655440000',
      branchId: '550e8400-e29b-41d4-a716-446655440001',
      slotId: '550e8400-e29b-41d4-a716-446655440002',
    });

    expect(response.status).toBe(201);
  });
});
