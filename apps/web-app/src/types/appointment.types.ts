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
  status: string;
  paymentStatus: string;
  appointmentReason?: string | null;
  createdAt: string;
  updatedAt: string;

  Doctor?: {
    id: string;
    user?: {
      id: string;
      full_name: string;
      email: string;
    };
  };

  Patient?: {
    id: string;
    user?: {
      id: string;
      full_name: string;
      email: string;
    };
  };

  slot?: {
    slotDate: string;
    startTime: string;
    endTime: string;
  };
}

export interface Slot {
  id: string;
  doctorId: string;
  branchId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
}

export interface Doctor {
  id: string;
  specialization: string;
  user: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
}
