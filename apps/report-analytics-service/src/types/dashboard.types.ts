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
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  days?: number;
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
  appointmentId: string;
  patientName: string;
  slotDate: Date;
  startTime: string;
  status: string;
}

export interface PatientUpcomingAppointment {
  appointmentId: string;
  doctorName: string;
  slotDate: Date;
  startTime: string;
  status: string;
}
