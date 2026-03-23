export interface PatientProfile {
  id: string;
  userId: string;
  address?: string;
  emergencyContact: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatientSearchResponse {
  total: number;
  page: number;
  limit: number;
  patients: PatientProfile[];
}

export interface PatientUser {
  id: string;
  full_name: string;
  email: string;
}

export interface Patient {
  id: string;
  userId: string;
  address: string | null;
  emergencyContact: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: PatientUser;
}

export interface PatientSearchParams {
  page: number;
  limit: number;
  search?: string;
}

export interface PatientState {
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
