export interface ClinicalUser {
  full_name: string;
  email: string;
}

export interface ClinicalDoctor {
  user: ClinicalUser;
}

export interface ClinicalPatient {
  user: ClinicalUser;
}

export interface ClinicalSlot {
  slotDate: string;
  startTime: string;
  endTime: string;
}

export interface ClinicalAppointment {
  id: string;
  doctor: ClinicalDoctor;
  patient: ClinicalPatient;
  slot: ClinicalSlot;
}

export interface ConsultationNote {
  id: string;
  symptoms: string;
  diagnosis: string;
  prescriptions: string;
  notes: string | null;
  followUpDate: string | null;
  createdAt: string;
  appointment: ClinicalAppointment;
}

export interface ClinicalResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  data: ConsultationNote[];
}
