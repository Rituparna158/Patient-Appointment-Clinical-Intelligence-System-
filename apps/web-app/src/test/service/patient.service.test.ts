import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/api', () => ({
  api: vi.fn(),
}));

import { api } from '@/services/api';
import { PatientService } from '@/services/patient.service';
import type { PatientProfile } from '@/types/patient.types';

describe('Patient Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create patient (happy)', async () => {
    const mockProfile: PatientProfile = {
      id: 'p1',
      userId: 'u1',
      address: 'BBSR',
      emergencyContact: '9999999999',
      isActive: true,
      createdAt: '2026-03-22',
      updatedAt: '2026-03-22',
    };

    vi.mocked(api).mockResolvedValue({
      success: true,
      data: mockProfile,
    });

    const res = await PatientService.create({
      address: 'BBSR',
      emergencyContact: '9999999999',
    });

    expect(api).toHaveBeenCalled();
    expect(res.id).toBe('p1');
  });

  it('should fail create patient', async () => {
    vi.mocked(api).mockRejectedValue(new Error('Create failed'));

    await expect(
      PatientService.create({
        emergencyContact: '999',
      })
    ).rejects.toThrow('Create failed');
  });

  it('should fetch profile', async () => {
    const mockProfile: PatientProfile = {
      id: 'p1',
      userId: 'u1',
      address: 'BBSR',
      emergencyContact: '9999999999',
      isActive: true,
      createdAt: '',
      updatedAt: '',
    };

    vi.mocked(api).mockResolvedValue({
      success: true,
      data: mockProfile,
    });

    const res = await PatientService.getMyProfile();

    expect(res.userId).toBe('u1');
  });

  it('should update profile', async () => {
    const updated: PatientProfile = {
      id: 'p1',
      userId: 'u1',
      address: 'Cuttack',
      emergencyContact: '888',
      isActive: true,
      createdAt: '',
      updatedAt: '',
    };

    vi.mocked(api).mockResolvedValue({
      success: true,
      data: updated,
    });

    const res = await PatientService.update({
      address: 'Cuttack',
    });

    expect(res.address).toBe('Cuttack');
  });

  it('should delete profile', async () => {
    vi.mocked(api).mockResolvedValue({
      message: 'Deleted',
    });

    const res = await PatientService.delete();

    expect(res).toBe('Deleted');
  });
});
