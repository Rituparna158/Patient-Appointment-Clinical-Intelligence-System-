export interface DashboardCounters {
  totalAppointments: number;
  completedAppointments: number;
  newPatients: number;
  followUpsScheduled: number;
}

export interface DoctorDashboard {
  todayAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
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

export interface DoctorDashboardCountersProps {
  data: DoctorDashboard;
}

export interface DashboardState {
  counters: DashboardCounters | null;
  doctorcounters: DoctorDashboard | null;
  status: AppointmentStatus | null;
  trend: AppointmentTrend[];

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
  fetchTable: () => Promise<void>;

  setPage: (page: number) => void;
  setSort: (key: string) => void;
  setFrom: (v?: string) => void;
  setTo: (v?: string) => void;
}
