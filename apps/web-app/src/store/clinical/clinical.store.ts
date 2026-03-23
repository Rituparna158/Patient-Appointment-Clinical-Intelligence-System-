import { create } from 'zustand';
import { ClinicalService } from '@/services/clinical.service';
import type {
  ClinicalTableQuery,
  ClinicalState,
} from '../../types/clinical.types';

export const useClinicalStore = create<ClinicalState>((set, get) => ({
  notes: [],
  total: 0,
  loading: false,

  page: 1,
  limit: 10,

  search: '',

  from: undefined,
  to: undefined,

  sortBy: 'createdAt',
  sortOrder: 'DESC',

  setPage: (page: number) => set({ page }),

  setSearch: (search: string) =>
    set({
      search,
      page: 1,
    }),

  setFrom: (from?: string) =>
    set({
      from,
      page: 1,
    }),

  setTo: (to?: string) =>
    set({
      to,
      page: 1,
    }),

  setSort: (column: string) => {
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

  fetchDoctorConsultations: async () => {
    set({ loading: true });

    try {
      const state = get();

      const query: ClinicalTableQuery = {
        page: state.page,
        limit: state.limit,
        search: state.search,
        from: state.from,
        to: state.to,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      };

      const res = await ClinicalService.getDoctorConsultations(query);

      set({
        notes: res.data,
        total: res.total,
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchPatientTimeline: async () => {
    set({ loading: true });

    try {
      const state = get();

      const query: ClinicalTableQuery = {
        page: state.page,
        limit: state.limit,
        search: state.search,
        from: state.from,
        to: state.to,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      };

      const res = await ClinicalService.getPatientTimeline(query);

      set({
        notes: res.data,
        total: res.total,
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchAdminRecords: async () => {
    set({ loading: true });

    try {
      const state = get();

      const query: ClinicalTableQuery = {
        page: state.page,
        limit: state.limit,
        search: state.search,
        from: state.from,
        to: state.to,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      };

      const res = await ClinicalService.getAdminRecords(query);

      set({
        notes: res.data,
        total: res.total,
      });
    } finally {
      set({ loading: false });
    }
  },

  createNote: async (data) => {
    await ClinicalService.createNote(data);
  },
}));
