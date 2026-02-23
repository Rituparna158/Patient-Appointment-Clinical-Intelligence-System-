interface CreatePatientProfileDTO {
  address: string;
  emergencyContat: string;
}

interface UpdatePatientProfileDTO {
  address?: string;
  emergencyContat?: string;
}

interface PatientResponseDTO {
  id: string;
  userId: string;
  address?: string;
  emergencyContact?: string;
  isActive: Boolean;
}
export { CreatePatientProfileDTO, UpdatePatientProfileDTO, PatientResponseDTO };
