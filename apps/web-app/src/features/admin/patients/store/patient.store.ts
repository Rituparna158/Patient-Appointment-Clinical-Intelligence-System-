import { create } from 'zustand';
import type { Patient } from '../types/patient.types';
import { PatientService } from '@/services/patient.service';

interface PatientState {
  patients: Patient[];
  total: number;
  page: number;
  limit: number;
  search: string;
  loading: boolean;

  setPage: (page: number) => void;
  setSearch: (value: string) => void;
  fetchPatients: () => Promise<void>;
}

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
      const data = await PatientService.search({
        page,
        limit,
        ...(search ? { search } : {}),
      });

      set({
        patients: data.patients,
        total: data.total,
      });
    } catch (error) {
      console.error('Pateint fetch error:', error);
    } finally {
      set({ loading: false });
    }
  },
}));
