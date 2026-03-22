import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import app from '../src/app';
import * as service from '../src/services/patient.service';
import { Patient } from '@repo/shared-database';
import { NextFunction } from 'express';

vi.mock('../src/middlewares/auth.middleware', () => ({
  authenticate: (req: Request, res: Response, next: NextFunction) => {
    (req as Request & { user?: { userId: string } }).user = { userId: '1' };
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
    return (req: Request, res: Response, next: NextFunction) => next();
  },
}));

describe('Patient Routes', () => {
  it('POST /api/patient/profile', async () => {
    const patient = {
      id: '1',
      userId: '1',
      address: 'Delhi',
      emergencyContact: '9999999999',
      isActive: true,
    } as Patient;

    vi.spyOn(service, 'createProfile').mockResolvedValue(patient);

    const response = await request(app).post('/api/patient/profile').send({
      address: 'Delhi',
      emergencyContact: '9999999999',
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it('GET /api/patient/me', async () => {
    const patient = {
      id: '1',
      userId: '1',
    } as Patient;

    vi.spyOn(service, 'getProfile').mockResolvedValue(patient);

    const response = await request(app).get('/api/patient/me');

    expect(response.status).toBe(200);
  });

  it('PUT /api/patient/me', async () => {
    const patient = {
      id: '1',
      userId: '1',
      address: 'Mumbai',
    } as Patient;

    vi.spyOn(service, 'updateProfile').mockResolvedValue(patient);

    const response = await request(app).put('/api/patient/me').send({
      address: 'Mumbai',
    });

    expect(response.status).toBe(200);
  });

  it('DELETE /api/patient/me', async () => {
    const patient = {
      id: '1',
      userId: '1',
      address: 'Delhi',
      emergencyContact: '9999999999',
      isActive: false,
    } as Patient;

    vi.spyOn(service, 'deleteProfile').mockResolvedValue(patient);

    const response = await request(app).delete('/api/patient/me');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
