import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/api', () => ({
  api: vi.fn(),
}));

import { api } from '@/services/api';
import { ClinicalService } from '@/services/clinical.service';

describe('Clinical Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch patient timeline', async () => {
    vi.mocked(api).mockResolvedValue({
      success: true,
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    });

    const res = await ClinicalService.getPatientTimeline({
      page: 1,
      limit: 10,
    });

    expect(res.total).toBe(0);
  });

  it('should fail timeline', async () => {
    vi.mocked(api).mockRejectedValue(new Error('error'));

    await expect(
      ClinicalService.getPatientTimeline({
        page: 1,
        limit: 10,
      })
    ).rejects.toThrow('error');
  });

  it('should create note', async () => {
    vi.mocked(api).mockResolvedValue({ success: true });

    await ClinicalService.createNote({
      appointmentId: 'a1',
      symptoms: 'fever',
      diagnosis: 'viral',
      prescriptions: 'paracetamol',
    });

    expect(api).toHaveBeenCalled();
  });
});
