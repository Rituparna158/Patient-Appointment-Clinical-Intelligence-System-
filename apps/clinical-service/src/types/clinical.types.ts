import { ConsultaionNote } from '@repo/shared-database';
import { Appointment } from '@repo/shared-database';
import { Patient } from '@repo/shared-database';

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
