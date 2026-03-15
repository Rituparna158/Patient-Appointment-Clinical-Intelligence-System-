export interface ExportQuery {
  range?: 'today' | 'month' | 'week' | 'year';
  from?: string;
  to?: string;

  role: 'admin' | 'doctor';
  doctorId?: string;

  delivery: 'download' | 'email';
  userId: string;
  email?: string;
}

export interface AuthUser {
  userId: string;
  email?: string;
  roles: string[];
}

export interface AdminCSVRow {
  date: Date;
  doctorName: string;
  patientName: string;
  appointmentStatus: string;
  slotDate: string;
  startTime: string;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  missedAppointments: number;
  newPatients: number;
  uniquePatients: number;
  followUpsScheduled: number;
}

export interface DoctorCSVRow {
  appointmentId: string;
  patientName: string;
  slotDate: string;
  startTime: string;
  status: string;
}
