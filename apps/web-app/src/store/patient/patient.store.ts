import { create } from 'zustand';
import type { PatientState } from '@/types/patient.types';
import { PatientService } from '@/services/patient.service';

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  total: 0,
  page: 1,
  limit: 10,
  search: '',
  loading: false,

  setPage: (page) => set({ page }),

  setSearch: (value) => set({ search: value, page: 1 }),

  fetchPatients: async () => {
    const { page, limit, search } = get();

    if (get().loading) return;

    set({ loading: true });

    try {
      const data = await PatientService.searchPatient({
        page,
        limit,
        ...(search ? { search } : {}),
      });

      set({
        patients: data.patients,
        total: data.total,
      });
    } catch (error) {
      console.error({ error }, 'Pateint fetch error:');
    } finally {
      set({ loading: false });
    }
  },
}));
