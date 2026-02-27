import { api } from './api';
import type {
  PatientProfile,
  PatientSearchResponse,
} from '@/types/patient.types';

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

  async search(params: {
    search?: string;
    page: number;
    limit: number;
  }): Promise<PatientSearchResponse> {
    const query = new URLSearchParams(params as any).toString();

    const res: ApiResponse<PatientSearchResponse> = await api(
      `/patient?${query}`
    );

    return res.data;
  },
};
