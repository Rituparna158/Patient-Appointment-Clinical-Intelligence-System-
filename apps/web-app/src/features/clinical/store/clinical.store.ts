import { create } from 'zustand';
import { ClinicalService } from '@/services/clinical.service';
import type { ConsultationNote } from '../types/clinical.types';

interface CreateNotePayload {
  appointmentId: string;
  symptoms: string;
  diagnosis: string;
  prescriptions: string;
  notes?: string;
  followUpDate?: string;
}

interface ClinicalState {
  notes: ConsultationNote[];
  total: number;
  page: number;
  limit: number;
  search: string;

  setPage: (page: number) => void;
  setSearch: (search: string) => void;

  fetchDoctorConsultations: () => Promise<void>;
  fetchPatientTimeline: () => Promise<void>;
  fetchAdminRecords: () => Promise<void>;

  createNote: (payload: CreateNotePayload) => Promise<void>;
}

export const useClinicalStore = create<ClinicalState>((set, get) => ({
  notes: [],
  total: 0,
  page: 1,
  limit: 10,
  search: '',

  setPage: (page) => set({ page }),

  setSearch: (search) =>
    set({
      search,
      page: 1,
    }),

  fetchDoctorConsultations: async () => {
    const { page, limit, search } = get();

    const res = await ClinicalService.getDoctorConsultations(
      page,
      limit,
      search
    );

    set({
      notes: res.data,
      total: res.total,
    });
  },

  fetchPatientTimeline: async () => {
    const { page, limit } = get();

    const res = await ClinicalService.getPatientTimeline(page, limit);

    set({
      notes: res.data,
      total: res.total,
    });
  },

  fetchAdminRecords: async () => {
    const { page, limit, search } = get();

    const res = await ClinicalService.getAdminRecords(page, limit, search);

    set({
      notes: res.data,
      total: res.total,
    });
  },

  createNote: async (payload) => {
    await ClinicalService.createNote(payload);
  },
}));
