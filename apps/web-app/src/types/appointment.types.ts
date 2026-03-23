export type AppointmentStatus =
  | 'requested'
  | 'confirmed'
  | 'completed'
  | 'missed'
  | 'cancelled'
  | 'rescheduled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  branchId: string;
  slotId: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  appointmentReason?: string | null;
  createdAt: string;
  updatedAt: string;

  doctor?: {
    id: string;
    user?: {
      id: string;
      full_name: string;
      email: string;
    };
  };

  patient?: {
    id: string;
    user?: {
      id: string;
      full_name: string;
      email: string;
    };
  };

  slot?: {
    id?: string;
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
  isBooked?: boolean;
  isActive?: boolean;
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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedAppointments {
  rows: Appointment[];
  count: number;
}

export interface AppointmentState {
  appointments: Appointment[];
  total: number;
  page: number;
  limit: number;
  search: string;
  status: string;
  branchId?: string;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  fromDate?: string;
  toDate?: string;
  loading: boolean;
  setSearch: (value: string) => void;
  setStatus: (value: string) => void;
  setBranch: (value: string | undefined) => void;
  setPage: (page: number) => void;
  setSort: (column: string) => void;
  setDateRange: (from?: string, to?: string) => void;
  fetchDoctorAppointments: () => Promise<void>;
  fetchMyAppointments: () => Promise<void>;
  fetchAdminAppointments: () => Promise<void>;
}

export interface AppointmentTableProps {
  appointments: Appointment[];
  onCancel: (id: string) => void;
}
