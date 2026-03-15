import { describe, it, expect, vi } from 'vitest';
import { createProfile } from '../src/controllers/patient.controller';
import * as service from '../src/services/patient.service';
import { HTTP_STATUS } from '../src/constants/http_status';
import { Patient } from '../src/models/patient.model';

function createMockRes() {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };

  res.status.mockReturnValue(res);
  return res;
}

describe('createProfile controller', () => {
  it('should create profile successfully', async () => {
    const req = {
      user: { userId: '1' },
      body: { address: 'Delhi' },
    };

    const res = createMockRes();
    const next = vi.fn();

    const mockPatient = {
      id: '1',
      address: 'Delhi',
      emergencyContact: '9999999999',
      userId: '1',
      isActive: true,
    } as Patient;

    vi.spyOn(service, 'createProfile').mockResolvedValue(mockPatient);

    await createProfile(req as never, res as never, next);

    expect(service.createProfile).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
  });

  it('should return unauthorized if user missing', async () => {
    const req = {
      user: undefined,
      body: {},
    };

    const res = createMockRes();
    const next = vi.fn();

    await createProfile(req as never, res as never, next);

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
  });
});
