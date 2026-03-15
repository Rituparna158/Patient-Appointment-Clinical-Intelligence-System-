import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { Express } from 'express';
import request from 'supertest';

import * as controller from '../../src/controllers/export.controller';
import * as service from '../../src/services/export.service';
import { Doctor } from '../../src/models/external/doctor.model';

vi.mock('../../src/services/export.service');
vi.mock('../../src/models/external/doctor.model');

const mockedService = service as {
  requestExport: () => Promise<{ filePath?: string; message?: string }>;
  requestDoctorExport: () => Promise<{ filePath?: string; message?: string }>;
};

const mockedDoctor = Doctor as {
  findOne: (args: {
    where: { userId: string };
  }) => Promise<{ id: string } | null>;
};

const createApp = (): Express => {
  const app = express();

  app.use((req, res, next) => {
    req.user = {
      userId: 'admin1',
      email: 'admin@mail.com',
      roles: ['admin'],
    };
    next();
  });

  app.get('/export', controller.exportAnalytics);

  return app;
};

describe('Export Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should download admin csv', async () => {
    mockedService.requestExport = vi.fn().mockResolvedValue({
      filePath: '/tmp/report.csv',
    });

    const app = createApp();

    const res = await request(app).get('/export?delivery=download');

    expect(res.status).toBe(200);
  });

  it('should queue export job', async () => {
    mockedService.requestExport = vi.fn().mockResolvedValue({
      message: 'Export job added to queue',
    });

    const app = createApp();

    const res = await request(app).get('/export?delivery=email');

    expect(res.status).toBe(202);
  });

  it('should return 400 if delivery missing', async () => {
    const app = createApp();

    const res = await request(app).get('/export');

    expect(res.status).toBe(400);
  });
});
