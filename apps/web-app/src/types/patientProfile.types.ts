import type { ConsultationNote } from './clinical.types';

export interface Patient {
  id: string;

  user: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface PatientProfileResponse {
  patient: Patient;
  consultations: ConsultationNote[];
}

export interface PatientProfileApiResponse {
  success: boolean;
  data: PatientProfileResponse;
}

export interface Props {
  open: boolean;
  patientId: string | null;
  onClose: () => void;
}
