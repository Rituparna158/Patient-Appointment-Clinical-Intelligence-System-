import { create } from 'zustand';
import type { DoctorState } from '@/types/doctor.types';
import { PatientService } from '@/services/patient.service';

export const useDoctorStore = create<DoctorState>((set, get) => ({
  doctors: [],
  total: 0,
  page: 1,
  limit: 10,
  search: '',
  loading: false,

  setPage: (page) => set({ page }),

  setSearch: (value) => set({ search: value, page: 1 }),

  fetchDoctors: async () => {
    const { page, limit, search } = get();

    if (get().loading) return;

    set({ loading: true });

    try {
      const data = await PatientService.searchDoctor({
        page,
        limit,
        ...(search ? { search } : {}),
      });

      set({
        doctors: data.doctors,
        total: data.total,
      });
    } catch (error) {
      console.error({ error }, 'Doctor fetch error:');
    } finally {
      set({ loading: false });
    }
  },
}));
