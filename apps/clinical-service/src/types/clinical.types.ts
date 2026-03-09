import { ConsultaionNote } from '../models/consultationNote.model';
import { Appointment } from '../models/external/appointment.model';
import { Patient } from '../models/external/patient.model';

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

export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface TableQueryOptions {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  from?: string;
  to?: string;
}

export interface GetDoctorConsultationsInput
  extends PaginationQuery, TableQueryOptions {
  doctorUserId: string;
}

export interface GetPatientTimelineInput
  extends PaginationQuery, TableQueryOptions {
  userId: string;
}

export interface GetAllClinicalRecordsInput
  extends PaginationQuery, TableQueryOptions {}

export interface ConsultationWithAppointment extends ConsultaionNote {
  appointment?: Appointment & {
    patient?: Patient;
  };
}
