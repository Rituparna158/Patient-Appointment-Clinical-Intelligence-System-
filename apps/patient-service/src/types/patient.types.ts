interface CreatePatientDTO {
  address?: string;
  emergencyContat?: string;
}

interface UpdatePatientDTO {
  address?: string;
  emergencyContat?: string;
}

interface PatientSearchQuery {
  search?: string;
  page: number;
  limit: number;
}
export { CreatePatientDTO, UpdatePatientDTO, PatientSearchQuery };
