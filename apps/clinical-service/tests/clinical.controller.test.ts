import { describe, it, expect, vi } from 'vitest';
import * as controller from '../src/controllers/clinical.controller';
import * as service from '../src/services/clinical.service';

function mockResponse() {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };

  res.status.mockReturnValue(res);
  return res;
}

describe('clinical controller', () => {
  it('should create consultation note', async () => {
    const req = {
      user: { userId: 'doctor1' },
      body: {
        appointmentId: 'appt1',
        symptoms: 'fever',
        diagnosis: 'viral',
        prescriptions: 'medicine',
      },
    };

    const res = mockResponse();
    const next = vi.fn();

    vi.spyOn(service, 'createNote').mockResolvedValue({ id: 'note1' } as never);

    await controller.createConsultationNote(req as never, res as never, next);

    expect(service.createNote).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('should return unauthorized if user missing', async () => {
    const req = {
      user: undefined,
      body: {},
    };

    const res = mockResponse();
    const next = vi.fn();

    await controller.createConsultationNote(req as never, res as never, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
