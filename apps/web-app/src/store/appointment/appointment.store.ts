import { create } from 'zustand';
import { AppointmentService } from '@/services/appointment.service';

import type { AppointmentState } from '@/types/appointment.types';
import type { AppointmentTableQuery } from '@/types/table.types';

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],
  total: 0,

  page: 1,
  limit: 10,

  search: '',
  status: '',
  branchId: undefined,

  sortBy: 'createdAt',
  sortOrder: 'DESC',

  fromDate: undefined,
  toDate: undefined,

  loading: false,

  setSearch: (value) =>
    set({
      search: value,
      page: 1,
    }),

  setStatus: (value) =>
    set({
      status: value,
      page: 1,
    }),

  setBranch: (value) =>
    set({
      branchId: value,
      page: 1,
    }),

  setPage: (page) => set({ page }),

  setSort: (column) => {
    const { sortBy, sortOrder } = get();

    if (sortBy === column) {
      set({
        sortOrder: sortOrder === 'ASC' ? 'DESC' : 'ASC',
      });
    } else {
      set({
        sortBy: column,
        sortOrder: 'ASC',
      });
    }
  },

  setDateRange: (from, to) =>
    set({
      fromDate: from,
      toDate: to,
      page: 1,
    }),

  fetchDoctorAppointments: async () => {
    set({ loading: true });

    try {
      const {
        page,
        limit,
        search,
        status,
        branchId,
        sortBy,
        sortOrder,
        fromDate,
        toDate,
      } = get();

      const query: AppointmentTableQuery = {
        page,
        limit,
        search,
        status,
        branchId,
        sortBy,
        sortOrder,
        fromDate,
        toDate,
      };

      const data = await AppointmentService.getDoctorAppointments(query);

      set({
        appointments: data.rows ?? [],
        total: data.count ?? 0,
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchMyAppointments: async () => {
    set({ loading: true });

    try {
      const {
        page,
        limit,
        search,
        status,
        sortBy,
        sortOrder,
        fromDate,
        toDate,
      } = get();

      const query: AppointmentTableQuery = {
        page,
        limit,
        search,
        status,
        sortBy,
        sortOrder,
        fromDate,
        toDate,
      };

      const data = await AppointmentService.getMyAppointments(query);

      set({
        appointments: data.rows ?? [],
        total: data.count ?? 0,
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchAdminAppointments: async () => {
    set({ loading: true });

    try {
      const {
        page,
        limit,
        search,
        status,
        branchId,
        sortBy,
        sortOrder,
        fromDate,
        toDate,
      } = get();

      const query: AppointmentTableQuery = {
        page,
        limit,
        search,
        status,
        branchId,
        sortBy,
        sortOrder,
        fromDate,
        toDate,
      };

      const data = await AppointmentService.adminSearch(query);

      set({
        appointments: data.rows ?? [],
        total: data.count ?? 0,
      });
    } finally {
      set({ loading: false });
    }
  },
}));
