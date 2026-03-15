import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import app from '../src/app';
import * as service from '../src/services/clinical.service';
import { Request, Response, NextFunction } from 'express';

vi.mock('../src/middlewares/auth.middleware', () => ({
  authenticate: (req: Request, res: Response, next: NextFunction) => {
    (req as Request & { user?: { userId: string } }).user = {
      userId: 'doctor1',
    };
    next();
  },
}));

vi.mock('../src/middlewares/rbac.middleware', () => ({
  authorizeRole: () => {
    return (req: Request, res: Response, next: NextFunction) => next();
  },
  authorizePermission: () => {
    return (req: Request, res: Response, next: NextFunction) => next();
  },
}));

vi.mock('../src/middlewares/validate.middleware', () => ({
  validateBody: () => {
    return (req: Request, res: Response, next: NextFunction) => next();
  },
  validateQuery: () => {
    return (req: Request, res: Response, next: NextFunction) => {
      (req as Request & { validateQuery: unknown }).validateQuery = {
        page: 1,
        limit: 10,
      };
      next();
    };
  },
}));

describe('clinical routes', () => {
  it('POST /api/clinical/notes', async () => {
    vi.spyOn(service, 'createNote').mockResolvedValue({ id: 'note1' } as never);

    const response = await request(app).post('/api/clinical/notes').send({
      appointmentId: 'appt1',
      symptoms: 'fever',
      diagnosis: 'viral',
      prescriptions: 'medicine',
    });

    expect(response.status).toBe(201);
  });

  it('GET /api/clinical/doctor/me', async () => {
    vi.spyOn(service, 'getDoctorConsultations').mockResolvedValue({
      rows: [],
      count: 0,
    } as never);

    const response = await request(app).get('/api/clinical/doctor/me');

    expect(response.status).toBe(200);
  });
});
