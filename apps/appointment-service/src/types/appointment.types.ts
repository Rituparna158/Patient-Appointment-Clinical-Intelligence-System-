export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface TableQueryOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export type AppointmentStatus =
  | 'requested'
  | 'confirmed'
  | 'completed'
  | 'missed'
  | 'cancelled'
  | 'rescheduled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface CreateAppointmentData {
  patientId: string;
  doctorId: string;
  branchId: string;
  slotId: string;
  appointmentReason?: string;
}

export interface BookAppointmentInput {
  userId: string;
  doctorId: string;
  branchId: string;
  slotId: string;
  appointmentReason?: string;
}

export interface ChangeAppointmentStatusInput {
  appointmentId: string;
  status: AppointmentStatus;
}

export interface ConfirmPaymentInput {
  appointmentId: string;
}

export interface GetPatientAppointmentsInput
  extends PaginationQuery, TableQueryOptions {
  userId: string;
  status?: AppointmentStatus;
  fromDate?: string;
  toDate?: string;
}

export interface GetDoctorAppointmentsInput
  extends PaginationQuery, TableQueryOptions {
  doctorId: string;
  status?: AppointmentStatus;
  fromDate?: string;
  toDate?: string;
}

export interface GetDoctorAppointmentsByUserInput
  extends PaginationQuery, TableQueryOptions {
  userId: string;
  status?: AppointmentStatus;
  fromDate?: string;
  toDate?: string;
}
export interface AdminSearchAppointmentsInput
  extends PaginationQuery, TableQueryOptions {
  branchId?: string;
  status?: AppointmentStatus;
  fromDate?: string;
  toDate?: string;
}

export interface GetAvailableSlotsInput {
  doctorId: string;
  date: string;
}

export interface CreateSlotInput {
  doctorId: string;
  branchId: string;
  startTime: string;
  endTime: string;
}

export interface CreateBranchInput {
  name: string;
  address: string;
  phone: string;
}
