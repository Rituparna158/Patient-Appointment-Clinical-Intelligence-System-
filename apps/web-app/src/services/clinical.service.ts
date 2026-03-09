import type { PatientProfileResponse } from '@/types/patientProfile.types';
import { api } from './api';
import type {
  ClinicalResponse,
  ClinicalTableQuery,
} from '@/types/clinical.types';

function buildQuery(query: ClinicalTableQuery) {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  if (query.search) params.append('search', query.search);
  if (query.sortBy) params.append('sortBy', query.sortBy);
  if (query.sortOrder) params.append('sortOrder', query.sortOrder);
  if (query.from) params.append('from', query.from);
  if (query.to) params.append('to', query.to);

  return params.toString();
}

export const ClinicalService = {
  async getDoctorConsultations(
    query: ClinicalTableQuery
  ): Promise<ClinicalResponse> {
    return api(`/clinical/doctor/me?${buildQuery(query)}`);
  },

  async getPatientTimeline(
    query: ClinicalTableQuery
  ): Promise<ClinicalResponse> {
    return api(`/clinical/patient/me?${buildQuery(query)}`);
  },

  async getAdminRecords(query: ClinicalTableQuery): Promise<ClinicalResponse> {
    return api(`/clinical/admin?${buildQuery(query)}`);
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

  async getPatientProfile(patientId: string): Promise<PatientProfileResponse> {
    const res = await api(`/clinical/doctor/patient/${patientId}`);

    return res.data;
  },
};
