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
