//

export type AppointmentStatus =
  | 'requested'
  | 'confirmed'
  | 'completed'
  | 'missed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

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

export interface GetPatientAppointmentsInput {
  userId: string;
  page: number;
  limit: number;
}

export interface GetDoctorAppointmentsInput {
  doctorId: string;
  page: number;
  limit: number;
}

export interface AdminSearchAppointmentsInput {
  branchId?: string;
  status?: AppointmentStatus;
  search?: string;
  page: number;
  limit: number;
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
