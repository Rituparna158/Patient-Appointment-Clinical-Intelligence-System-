import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';

import * as controller from '../src/controllers/appointment.controller';
import * as appointmentService from '../src/services/appointment.service';
import { Appointment } from '../src/models/appointment.model';

/* ----------- Mock Response ----------- */

function createMockResponse(): Response {
  const res = {} as Response;

  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);

  return res;
}

/* ----------- Tests ----------- */

describe('Appointment Controller', () => {
  it('should return appointment when booking successful', async () => {
    const req = {
      user: { userId: 'user1' },
      body: {
        doctorId: 'doctor1',
        branchId: 'branch1',
        slotId: 'slot1',
      },
    } as Partial<Request> as Request;

    const res = createMockResponse();

    const next: NextFunction = vi.fn();

    const appointment = {
      id: 'appointment1',
      patientId: 'patient1',
      doctorId: 'doctor1',
      branchId: 'branch1',
      slotId: 'slot1',
      status: 'requested',
      paymentStatus: 'pending',
    } as Appointment;

    vi.spyOn(appointmentService, 'bookAppointment').mockResolvedValue(
      appointment
    );

    await controller.bookAppointment(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('should return unauthorized when user missing', async () => {
    const req = {
      body: {},
    } as Partial<Request> as Request;

    const res = createMockResponse();

    const next: NextFunction = vi.fn();

    await controller.bookAppointment(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
