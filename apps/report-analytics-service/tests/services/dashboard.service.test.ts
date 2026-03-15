import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as service from '../../src/services/dashboard.service';
import * as repo from '../../src/repositories/analytics.repository';

vi.mock('../../src/repositories/analytics.repository');

const mockedRepo = repo as {
  findCounters: () => Promise<
    Array<{
      totalAppointments: number;
      completedAppointments: number;
      newPatients: number;
      followUpsScheduled: number;
    }>
  >;
};

describe('Dashboard Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should aggregate dashboard counters', async () => {
    mockedRepo.findCounters = vi.fn().mockResolvedValue([
      {
        totalAppointments: 5,
        completedAppointments: 2,
        newPatients: 1,
        followUpsScheduled: 1,
      },
      {
        totalAppointments: 5,
        completedAppointments: 3,
        newPatients: 2,
        followUpsScheduled: 0,
      },
    ]);

    const result = await service.getDashboardCounters('today');

    expect(result.totalAppointments).toBe(10);
    expect(result.completedAppointments).toBe(5);
  });
});
