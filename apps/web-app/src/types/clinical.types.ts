export interface ClinicalUser {
  id: string;
  full_name: string;
  email: string;
}

export interface ClinicalDoctor {
  user: ClinicalUser;
}

export interface ClinicalPatient {
  id: string;
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

export interface ClinicalTableQuery {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  from?: string;
  to?: string;
}

export interface ClinicalState {
  notes: ConsultationNote[];
  total: number;
  loading: boolean;

  page: number;
  limit: number;

  search: string;

  from?: string;
  to?: string;

  sortBy: string;
  sortOrder: 'ASC' | 'DESC';

  setPage: (page: number) => void;
  setSearch: (value: string) => void;
  setFrom: (value?: string) => void;
  setTo: (value?: string) => void;
  setSort: (column: string) => void;

  fetchDoctorConsultations: () => Promise<void>;
  fetchPatientTimeline: () => Promise<void>;
  fetchAdminRecords: () => Promise<void>;

  createNote: (data: {
    appointmentId: string;
    symptoms: string;
    diagnosis: string;
    prescriptions: string;
    notes?: string;
    followUpDate?: string;
  }) => Promise<void>;
}

export interface PatientProfile {
  patient: ClinicalPatient;

  consultations: ConsultationRow[];
}

export interface ConsultationRow {
  id: string;
  symptoms: string;
  diagnosis: string;
  prescriptions: string;
  createdAt: string;

  appointment?: {
    slot?: {
      slotDate: string;
      startTime: string;
      endTime: string;
    };

    doctor?: {
      user?: {
        full_name: string;
      };
    };
  };
}
