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

export interface PatientSearchResponse {
  total: number;
  page: number;
  limit: number;
  patients: Patient[];
}
