import { api } from './api';
import type { ClinicalResponse } from '@/features/clinical/types/clinical.types';

export const ClinicalService = {
  async getDoctorConsultations(
    page: number,
    limit: number,
    search: string
  ): Promise<ClinicalResponse> {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search ? { search } : {}),
    });

    return api(`/clinical/doctor/me?${query}`);
  },

  async getPatientTimeline(
    page: number,
    limit: number
  ): Promise<ClinicalResponse> {
    return api(`/clinical/patient/me?page=${page}&limit=${limit}`);
  },

  async getAdminRecords(
    page: number,
    limit: number,
    search: string
  ): Promise<ClinicalResponse> {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search ? { search } : {}),
    });

    return api(`/clinical/admin?${query}`);
  },

  async createNote(data: {
    appointmentId: string;
    symptoms: string;
    diagnosis: string;
    prescriptions: string;
    notes?: string;
    followUpDate?: string;
  }) {
    return api('/clinical/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateNote(
    noteId: string,
    data: {
      symptoms?: string;
      diagnosis?: string;
      prescriptions?: string;
      notes?: string;
    }
  ) {
    return api(`/clinical/notes/${noteId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async getNotesByAppointment(appointmentId: string) {
    return api(`/clinical/notes/${appointmentId}`);
  },
};
