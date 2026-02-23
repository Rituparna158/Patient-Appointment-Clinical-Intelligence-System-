import { describe, it, expect, vi, beforeEach } from 'vitest';

const serviceMocks = vi.hoisted(() => ({
  createDoctorUser: vi.fn(),
  createAdminUser: vi.fn(),
}));

vi.mock('../../src/services/admin.service', () => serviceMocks);

vi.mock('../../src/validators/admin.validator', () => ({
  createDoctorSchema: { parse: (d: any) => d },
  createAdminSchema: { parse: (d: any) => d },
}));

import {
  createDoctor,
  createAdmin,
} from '../../src/controllers/admin.controller';

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('Admin Controller Unit Tests', () => {
  let next: any;

  beforeEach(() => {
    next = vi.fn();
    vi.clearAllMocks();
  });

  it('createDoctor - success', async () => {
    const req: any = {
      body: {
        email: 'doctor@gmail.com',
        full_name: 'Doctor Name',
        phone: '9876543210',
        specialization: 'Cardiology',
        licence_no: 'LIC123',
        consultation_fee: 500,
        password: 'Password1@',
      },
    };

    const res = mockRes();

    serviceMocks.createDoctorUser.mockResolvedValue({
      user: { id: 1, email: 'doctor@gmail.com', full_name: 'Doctor Name' },
      doctorProfile: {
        specialization: 'Cardiology',
        licence_no: 'LIC123',
        consultation_fee: 500,
        is_active: true,
      },
    });

    await createDoctor(req, res, next);

    expect(serviceMocks.createDoctorUser).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it('createAdmin - success', async () => {
    const req: any = {
      body: {
        email: 'admin@gmail.com',
        full_name: 'Admin User',
        phone: '9876543210',
        password: 'Password1@',
      },
    };

    const res = mockRes();

    serviceMocks.createAdminUser.mockResolvedValue({
      id: 2,
      email: 'admin@gmail.com',
      full_name: 'Admin User',
    });

    await createAdmin(req, res, next);

    expect(serviceMocks.createAdminUser).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it('createDoctor - error', async () => {
    const req: any = { body: {} };
    const res = mockRes();

    serviceMocks.createDoctorUser.mockRejectedValue(new Error('error'));

    await createDoctor(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('createAdmin - error', async () => {
    const req: any = { body: {} };
    const res = mockRes();

    serviceMocks.createAdminUser.mockRejectedValue(new Error('error'));

    await createAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
