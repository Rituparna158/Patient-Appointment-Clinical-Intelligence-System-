export interface DashboardCounters {
  totalAppointments: number;
  completedAppointments: number;
  newPatients: number;
  followUpsScheduled: number;
}

export interface DoctorUpcomingAppointment {
  appointmentId: string;
  patientName: string;
  slotDate: string;
  startTime: string;
  status: string;
}

export interface DoctorDashboardCounters {
  todayAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

export interface DoctorDashboard {
  counters: DoctorDashboardCounters;
  upcoming: DoctorUpcomingAppointment[];
}

export interface PatientDashboardCounters {
  upcomingAppointments: number;
  completedAppointments: number;
}

export interface PatientUpcomingAppointment {
  id: string;
  doctorName: string;
  slotDate: string;
  startTime: string;
  status: string;
}
export interface PatientDashboard {
  counters: PatientDashboardCounters;
  upcoming: PatientUpcomingAppointment[];
}

export interface AppointmentTrend {
  date: string;
  totalAppointments: number;
}

export interface AppointmentStatus {
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  missedAppointments: number;
}

export interface DoctorAppointmentRow {
  id: string;
  patientName: string;
  slotDate: Date;
  startTime: string;
  status: string;
}

export interface DoctorDashboardTableResponse {
  total: number;
  rows: DoctorAppointmentRow[];
}

export interface PatientAppointmentRow {
  id: string;
  patientName: string;
  slotDate: Date;
  startTime: string;
  status: string;
}

export interface PatientDashboardTableResponse {
  total: number;
  rows: PatientAppointmentRow[];
}
export interface DailyAnalyticsRow {
  id: string;
  date: string;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  missedAppointments: number;
  uniquePatients: number;
  followUpsScheduled: number;
}

export interface DashboardTableResponse {
  total: number;
  rows: DailyAnalyticsRow[];
}

export interface AppointmentTrendProps {
  data: AppointmentTrend[];
}

export interface AppointmentStatusProps {
  data: AppointmentStatus;
}

export interface DashboardCountersProps {
  data: DashboardCounters;
}

// export interface DoctorDashboardCountersProps {
//   data: DoctorDashboard;
// }

export type RangeType = 'today' | 'week' | 'month' | 'year';
export interface DashboardState {
  counters: DashboardCounters | null;
  doctorDashboard: DoctorDashboard | null;
  patientDashboard: PatientDashboard | null;
  status: AppointmentStatus | null;
  trend: AppointmentTrend[];

  range: RangeType;

  rows: DailyAnalyticsRow[];
  total: number;

  page: number;
  limit: number;

  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';

  from?: string;
  to?: string;

  fetchAdminDashboard: () => Promise<void>;
  fetchDoctorDashboard: () => Promise<void>;
  fetchPatientDashboard: () => Promise<void>;
  fetchAdminTable: () => Promise<void>;
  fetchDoctorTable: () => Promise<void>;
  fetchPatientTable: () => Promise<void>;

  setRange: (range: RangeType) => void;
  setPage: (page: number) => void;
  setSort: (key: string) => void;
  setFrom: (v?: string) => void;
  setTo: (v?: string) => void;
}

export interface DoctorUpcomingAppointment {
  id: string;
  patientName: string;
  slotDate: string;
  startTime: string;
  status: string;
}

export interface DoctorDashboardCounters {
  todayAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

export interface DoctorDashboardCountersProps {
  data: DoctorDashboardCounters;
}

export interface PatientDashboardCountersProps {
  data: PatientDashboardCounters;
}
