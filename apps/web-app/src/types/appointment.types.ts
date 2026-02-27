export type AppointmentStatus =
  | 'requested'
  | 'confirmed'
  | 'completed'
  | 'missed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  branchId: string;
  slotId: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  appointmentReason?: string;
  createdAt: string;
}

export interface Slot {
  id: string;
  doctorId: string;
  branchId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
}
