export type RangeType = 'today' | 'month' | 'week' | 'year';
export interface ReportJobData {
  range?: RangeType;

  from?: string;
  to?: string;

  role: 'admin' | 'doctor';
  doctorId?: string;

  delivery: 'email' | 'download';

  userId: string;
  email?: string;
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
