import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/appointment.service', () => ({
  AppointmentService: {
    getDoctorAppointments: vi.fn(),
    getMyAppointments: vi.fn(),
    adminSearch: vi.fn(),
  },
}));

import { useAppointmentStore } from '@/store/appointment/appointment.store';
import { AppointmentService } from '@/services/appointment.service';
import type { PaginatedAppointments } from '@/types/appointment.types';

describe('Appointment Store', () => {
  beforeEach(() => {
    useAppointmentStore.setState({
      appointments: [],
      total: 0,
      loading: false,
    });
  });

  it('should fetch doctor appointments', async () => {
    const mockResponse: PaginatedAppointments = {
      rows: [],
      count: 0,
    };

    vi.mocked(AppointmentService.getDoctorAppointments).mockResolvedValue(
      mockResponse
    );

    const store = useAppointmentStore.getState();

    await store.fetchDoctorAppointments();

    expect(AppointmentService.getDoctorAppointments).toHaveBeenCalled();
    expect(useAppointmentStore.getState().appointments).toEqual([]);
  });

  it('should toggle sorting', () => {
    const store = useAppointmentStore.getState();

    store.setSort('createdAt');
    expect(useAppointmentStore.getState().sortOrder).toBe('ASC');

    store.setSort('createdAt');
    expect(useAppointmentStore.getState().sortOrder).toBe('DESC');
  });
});
