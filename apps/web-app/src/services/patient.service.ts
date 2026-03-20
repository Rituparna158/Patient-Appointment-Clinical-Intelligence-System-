import { api } from './api';
import type { PatientProfile } from '@/types/patient.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const PatientService = {
  async create(data: {
    address?: string;
    emergencyContact: string;
  }): Promise<PatientProfile> {
    const res: ApiResponse<PatientProfile> = await api('/patient/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return res.data;
  },

  async getMyProfile(): Promise<PatientProfile> {
    const res: ApiResponse<PatientProfile> = await api('/patient/me');

    return res.data;
  },

  async update(data: {
    address?: string;
    emergencyContact?: string;
  }): Promise<PatientProfile> {
    const res: ApiResponse<PatientProfile> = await api('/patient/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    return res.data;
  },

  async delete(): Promise<string> {
    const res = await api('/patient/me', {
      method: 'DELETE',
    });

    return res.message;
  },

  async searchPatient(params: {
    search?: string;
    page: number;
    limit: number;
  }) {
    const query = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
    });
    if (params.search) {
      query.append('search', params.search);
    }

    const res = await api(`/patient/patient-search?${query.toString()}`);

    return res.data;
  },

  async searchDoctor(params: { search?: string; page: number; limit: number }) {
    const query = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
    });
    if (params.search) {
      query.append('search', params.search);
    }

    const res = await api(`/patient/doctor-search?${query.toString()}`);

    return res.data;
  },
};
