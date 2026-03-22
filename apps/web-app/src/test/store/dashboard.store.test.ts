import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/dashboard.service', () => ({
  DashboardService: {
    getCounters: vi.fn(),
    getStatus: vi.fn(),
    getTrend: vi.fn(),
    getDoctorDashboard: vi.fn(),
    getPatientDashboard: vi.fn(),
    getDoctorTrend: vi.fn(),
    getDoctorCompletion: vi.fn(),
    getDoctorPatients: vi.fn(),
    getDaily: vi.fn(),
    getDoctorTable: vi.fn(),
    getPatientTable: vi.fn(),
  },
}));

import { useDashboardStore } from '@/store/dashboard/dashboard.store';
import { DashboardService } from '@/services/dashboard.service';

describe('Dashboard Store', () => {
  beforeEach(() => {
    useDashboardStore.setState({
      counters: null,
      doctorDashboard: null,
      patientDashboard: null,
      status: null,
      trend: [],
      doctorTrend: [],
      completionRate: null,
      patientTypes: null,
      rows: [],
      total: 0,
      page: 1,
      limit: 10,
      range: 'week',
      sortBy: undefined,
      sortOrder: undefined,
      from: undefined,
      to: undefined,
    });
  });

  it('should fetch admin dashboard (happy case)', async () => {
    vi.mocked(DashboardService.getCounters).mockResolvedValue({
      totalAppointments: 10,
      completedAppointments: 5,
      newPatients: 2,
      followUpsScheduled: 1,
    });

    vi.mocked(DashboardService.getStatus).mockResolvedValue({
      confirmedAppointments: 5,
      completedAppointments: 3,
      cancelledAppointments: 1,
      missedAppointments: 1,
    });

    vi.mocked(DashboardService.getTrend).mockResolvedValue([]);

    const store = useDashboardStore.getState();

    await store.fetchAdminDashboard();

    const state = useDashboardStore.getState();

    expect(state.counters?.totalAppointments).toBe(10);
    expect(state.status?.confirmedAppointments).toBe(5);
  });

  it('should fetch doctor dashboard', async () => {
    vi.mocked(DashboardService.getDoctorDashboard).mockResolvedValue({
      counters: {
        todayAppointments: 5,
        completedAppointments: 2,
        cancelledAppointments: 1,
      },
      upcoming: [],
    });

    const store = useDashboardStore.getState();

    await store.fetchDoctorDashboard();

    expect(
      useDashboardStore.getState().doctorDashboard?.counters.todayAppointments
    ).toBe(5);
  });

  it('should fetch patient dashboard', async () => {
    vi.mocked(DashboardService.getPatientDashboard).mockResolvedValue({
      counters: {
        upcomingAppointments: 3,
        completedAppointments: 4,
      },
      upcoming: [],
    });

    const store = useDashboardStore.getState();

    await store.fetchPatientDashboard();

    expect(
      useDashboardStore.getState().patientDashboard?.counters
        .upcomingAppointments
    ).toBe(3);
  });

  it('should fetch doctor charts', async () => {
    vi.mocked(DashboardService.getDoctorTrend).mockResolvedValue([]);
    vi.mocked(DashboardService.getDoctorCompletion).mockResolvedValue({
      completed: 2,
      pending: 1,
      cancelled: 1,
    });
    vi.mocked(DashboardService.getDoctorPatients).mockResolvedValue({
      newPatients: 3,
      returningPatients: 2,
    });

    const store = useDashboardStore.getState();

    await store.fetchDoctorCharts();

    const state = useDashboardStore.getState();

    expect(state.completionRate?.completed).toBe(2);
    expect(state.patientTypes?.newPatients).toBe(3);
  });

  it('should fetch admin table', async () => {
    vi.mocked(DashboardService.getDaily).mockResolvedValue({
      rows: [],
      total: 5,
    });

    const store = useDashboardStore.getState();

    await store.fetchAdminTable();

    expect(useDashboardStore.getState().total).toBe(5);
  });

  it('should toggle sorting', () => {
    const store = useDashboardStore.getState();

    store.setSort('date');
    expect(useDashboardStore.getState().sortOrder).toBe('ASC');

    store.setSort('date');
    expect(useDashboardStore.getState().sortOrder).toBe('DESC');
  });

  it('should update range', () => {
    const store = useDashboardStore.getState();

    store.setRange('month');

    expect(useDashboardStore.getState().range).toBe('month');
  });
});
