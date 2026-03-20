export interface DoctorProfile {
  id: string;
  userId: string;
  specialization: string;
  consultation_fee: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorSearchResponse {
  total: number;
  page: number;
  limit: number;
  doctors: DoctorProfile[];
}

export interface DoctorUser {
  id: string;
  full_name: string;
  email: string;
}

export interface Doctor {
  id: string;
  userId: string;
  specialization: string;
  consultation_fee: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  user: DoctorUser;
}

export interface DoctorSearchParams {
  page: number;
  limit: number;
  search?: string;
}

export interface DoctorState {
  doctors: Doctor[];
  total: number;
  page: number;
  limit: number;
  search: string;
  loading: boolean;

  setPage: (page: number) => void;
  setSearch: (value: string) => void;
  fetchDoctors: () => Promise<void>;
}
