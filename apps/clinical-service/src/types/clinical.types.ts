export interface CreateConsultationNoteInput {
  appointmentId: string;
  symptoms: string;
  diagnosis: string;
  prescriptions: string;
  notes?: string;
  followUpDate?: string;
}

export interface UpdateConsultationNoteInput {
  symptoms: string;
  diagnosis: string;
  prescriptions: string;
  notes?: string;
  followUpDate?: string;
}
