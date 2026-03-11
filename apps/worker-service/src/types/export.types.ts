export interface ReportJobData {
  type: 'daily' | 'monthly';
  from?: string;
  to?: string;
  delivery: string;
  userId: string;
  email?: string;
}

export interface CSVRow {
  date: Date;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  missedAppointments: number;
  newPatients: number;
  uniquePatients: number;
  followUpsScheduled: number;
}
