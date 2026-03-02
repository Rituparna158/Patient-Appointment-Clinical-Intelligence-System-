import { create } from 'zustand';
import { AppointmentService } from '@/services/appointment.service';
import type { Appointment } from '@/types/appointment.types';

interface AppointmentState {
  appointments: Appointment[];
  total: number;
  page: number;
  limit: number;
  search: string;
  statusFilter: string;
  loading: boolean;

  setSearch: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setPage: (page: number) => void;

  fetchAppointments: () => Promise<void>;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],
  total: 0,
  page: 1,
  limit: 10,
  search: '',
  statusFilter: 'all',
  loading: false,

  setSearch: (value) =>
    set({
      search: value,
      page: 1,
    }),

  setStatusFilter: (value) =>
    set({
      statusFilter: value,
      page: 1,
    }),

  setPage: (page) => set({ page }),

  fetchAppointments: async () => {
    set({ loading: true });

    try {
      const { page, limit, search, statusFilter } = get();

      const data = await AppointmentService.adminSearch({
        page,
        limit,
        search,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });

      set({
        appointments: data.rows ?? [],
        total: data.count ?? 0,
      });
    } finally {
      set({ loading: false });
    }
  },
}));
