import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/api', () => ({
  api: vi.fn(),
}));

import { api } from '@/services/api';
import { DashboardService } from '@/services/dashboard.service';

describe('Dashboard Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get counters', async () => {
    vi.mocked(api).mockResolvedValue({
      data: {
        totalAppointments: 10,
        completedAppointments: 5,
        newPatients: 2,
        followUpsScheduled: 1,
      },
    });

    const res = await DashboardService.getCounters('week');

    expect(res.totalAppointments).toBe(10);
  });

  it('should fail counters', async () => {
    vi.mocked(api).mockRejectedValue(new Error('fail'));

    await expect(DashboardService.getCounters()).rejects.toThrow('fail');
  });

  it('should get trend', async () => {
    vi.mocked(api).mockResolvedValue({
      data: [{ date: '2026', totalAppointments: 5 }],
    });

    const res = await DashboardService.getTrend();

    expect(res.length).toBe(1);
  });
});
