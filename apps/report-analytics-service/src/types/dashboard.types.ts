export interface DashboardCounters {
  totalAppointments: number;
  completedAppointments: number;
  newPatients: number;
  followUpsScheduled: number;
}

export interface AppointmentTrend {
  date: Date;
  totalAppointments: number;
}

export interface AppointmentStatus {
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  missedAppointments: number;
  requestedAppointments: number;
}

export interface DailyAnalyticsTable {
  date: Date;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  missedAppointments: number;
  uniquePatients: number;
  followUpsScheduled: number;
}

export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface TableQueryOptions {
  from?: string;
  to?: string;
  sortBy?: 'date' | 'totalAppointments';
  sortOrder?: 'ASC' | 'DESC';
  days?: number;
  range?: 'today' | 'week' | 'month' | 'year';
}

export interface TableResult<T> {
  total: number;
  rows: T[];
}

export interface DoctorDashboardCounters {
  todayAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

export interface PatientDashboardCounters {
  upcomingAppointments: number;
  completedAppointments: number;
}

export interface DoctorUpcomingAppointment {
  id: string;
  patientName: string;
  slotDate: Date;
  startTime: string;
  status: string;
}

export interface PatientUpcomingAppointment {
  id: string;
  doctorName: string;
  slotDate: Date;
  startTime: string;
  status: string;
}

export interface DoctorAppointmentRow {
  id: string;
  patientName: string;
  slotDate: Date;
  startTime: string;
  status: string;
}

export interface PatientAppointmentRow {
  id: string;
  doctorName: string;
  slotDate: Date;
  startTime: string;
  status: string;
}

export interface ResolvedRange {
  start?: Date;
  end?: Date;
}
export type RangeType = 'today' | 'week' | 'month' | 'year';

export interface ResolvedRange {
  start?: Date;
  end?: Date;
}

export interface WorkloadTrendRow {
  date: Date;
  totalAppointments: number;
}

export interface CompletionRate {
  completed: number;
  pending: number;
  cancelled: number;
}

export interface PatientTypeStats {
  newPatients: number;
  returningPatients: number;
}

export interface ResolvedRange {
  start?: Date;
  end?: Date;
}

const startOfToday = (): Date => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
