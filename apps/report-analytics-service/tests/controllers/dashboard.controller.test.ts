import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { Express } from 'express';
import request from 'supertest';

import * as controller from '../../src/controllers/dashboard.controller';
import * as service from '../../src/services/dashboard.service';
import { Doctor } from '../../src/models/external/doctor.model';
import { Patient } from '../../src/models/external/patient.model';

vi.mock('../../src/services/dashboard.service');
vi.mock('../../src/models/external/doctor.model');
vi.mock('../../src/models/external/patient.model');

type CounterResult = {
  totalAppointments: number;
  completedAppointments: number;
  newPatients: number;
  followUpsScheduled: number;
};

const mockedService = service as {
  getDashboardCounters: (
    range?: 'today' | 'week' | 'month' | 'year'
  ) => Promise<CounterResult>;
  getDoctorDashboard: (
    doctorId: string
  ) => Promise<{
    counters: Record<string, number>;
    upcoming: Array<Record<string, string>>;
  }>;
};

const mockedDoctor = Doctor as {
  findOne: (args: {
    where: { userId: string };
  }) => Promise<{ id: string } | null>;
};

const mockedPatient = Patient as {
  findOne: (args: {
    where: { userId: string };
  }) => Promise<{ id: string } | null>;
};

const createApp = (): Express => {
  const app = express();

  app.use((req, res, next) => {
    req.user = {
      userId: 'user-1',
      email: 'test@mail.com',
      roles: ['doctor'],
    };
    next();
  });

  app.get('/admin/counters', controller.getCounters);
  app.get('/doctor/dashboard', controller.doctorDashboard);

  return app;
};

describe('Dashboard Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return dashboard counters', async () => {
    mockedService.getDashboardCounters = vi.fn().mockResolvedValue({
      totalAppointments: 10,
      completedAppointments: 6,
      newPatients: 3,
      followUpsScheduled: 1,
    });

    const app = createApp();

    const res = await request(app).get('/admin/counters');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalAppointments).toBe(10);
  });

  it('should return doctor dashboard', async () => {
    mockedDoctor.findOne = vi.fn().mockResolvedValue({ id: 'doc1' });

    mockedService.getDoctorDashboard = vi.fn().mockResolvedValue({
      counters: { appointments: 10 },
      upcoming: [],
    });

    const app = createApp();

    const res = await request(app).get('/doctor/dashboard');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 404 when doctor not found', async () => {
    mockedDoctor.findOne = vi.fn().mockResolvedValue(null);

    const app = createApp();

    const res = await request(app).get('/doctor/dashboard');

    expect(res.status).toBe(404);
  });

  it('should return 401 if user missing', async () => {
    const app = express();

    app.get('/doctor/dashboard', controller.doctorDashboard);

    const res = await request(app).get('/doctor/dashboard');

    expect(res.status).toBe(401);
  });
});
