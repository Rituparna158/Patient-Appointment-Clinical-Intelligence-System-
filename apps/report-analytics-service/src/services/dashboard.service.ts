import * as repo from '../repositories/analytics.repository';

import {
  DashboardCounters,
  AppointmentTrend,
  DoctorDashboardCounters,
  PatientDashboardCounters,
  DoctorUpcomingAppointment,
  PatientUpcomingAppointment,
  TableQueryOptions,
  RangeType,
} from '../types/dashboard.types';

export const getDashboardCounters = async (
  range?: RangeType
): Promise<DashboardCounters> => {
  const rows = await repo.findCounters(range);

  const result = rows.reduce(
    (acc, row) => {
      acc.totalAppointments += row.totalAppointments;
      acc.completedAppointments += row.completedAppointments;
      acc.newPatients += row.newPatients;
      acc.followUpsScheduled += row.followUpsScheduled;
      return acc;
    },
    {
      totalAppointments: 0,
      completedAppointments: 0,
      newPatients: 0,
      followUpsScheduled: 0,
    }
  );

  return result;
};

export const getAppointmentStatus = async (range?: RangeType) => {
  const rows = await repo.findAppointmentStatus(range);

  const result = rows.reduce(
    (acc, row) => {
      acc.confirmedAppointments += row.confirmedAppointments;
      acc.completedAppointments += row.completedAppointments;
      acc.cancelledAppointments += row.cancelledAppointments;
      acc.missedAppointments += row.missedAppointments;
      return acc;
    },
    {
      confirmedAppointments: 0,
      completedAppointments: 0,
      cancelledAppointments: 0,
      missedAppointments: 0,
    }
  );

  return result;
};

export const getAppointmentTrend = async (
  range?: RangeType
): Promise<AppointmentTrend[]> => {
  const rows = await repo.findAppointmentTrend(range);

  return rows.map((row) => ({
    date: row.date,
    totalAppointments: row.totalAppointments,
  }));
};

export const getDailyAnalytics = async (
  page: number,
  limit: number,
  options: TableQueryOptions
) => {
  const result = await repo.findDailyAnalytics(page, limit, options);

  return {
    total: result.count,
    rows: result.rows,
  };
};

export const getDoctorDashboard = async (doctorId: string) => {
  const counters: DoctorDashboardCounters =
    await repo.findDoctorCounters(doctorId);

  const upcoming = await repo.findDoctorUpcomingAppointments(doctorId);

  const formatted: DoctorUpcomingAppointment[] = upcoming.map((a) => ({
    id: a.id,
    patientName: a.patient?.user?.full_name ?? '-',
    slotDate: new Date(a.slot!.slotDate),
    startTime: a.slot!.startTime ?? '',
    status: a.status,
  }));

  return {
    counters,
    upcoming: formatted,
  };
};

export const getDoctorAppointments = async (
  doctorId: string,
  page: number,
  limit: number,
  from?: string,
  to?: string,
  sortBy: 'slotDate' | 'status' = 'slotDate',
  sortOrder: 'ASC' | 'DESC' = 'ASC'
) => {
  const result = await repo.findDoctorAppointmentsTable(
    doctorId,
    page,
    limit,
    from,
    to,
    sortBy,
    sortOrder
  );

  return {
    total: result.count,
    rows: result.rows,
  };
};

export const getPatientDashboard = async (patientId: string) => {
  const counters: PatientDashboardCounters =
    await repo.findPatientCounters(patientId);

  const upcoming = await repo.findPatientUpcomingAppointments(patientId);

  const formatted: PatientUpcomingAppointment[] = upcoming.map((a) => ({
    id: a.id,
    doctorName: a.doctor?.user?.full_name ?? '-',
    slotDate: new Date(a.slot!.slotDate),
    startTime: a.slot!.startTime ?? '',
    status: a.status,
  }));

  return {
    counters,
    upcoming: formatted,
  };
};

export const getPatientAppointments = async (
  patientId: string,
  page: number,
  limit: number,
  from?: string,
  to?: string,
  sortBy: 'slotDate' | 'status' = 'slotDate',
  sortOrder: 'ASC' | 'DESC' = 'ASC'
) => {
  const result = await repo.findPatientAppointmentsTable(
    patientId,
    page,
    limit,
    from,
    to,
    sortBy,
    sortOrder
  );

  return {
    total: result.count,
    rows: result.rows,
  };
};

export const getAnalyticsRange = async (from: string, to: string) => {
  return repo.findAnalyticsRange(from, to);
};

export const getDoctorWorkloadTrend = async (
  doctorId: string,
  range?: RangeType
) => {
  const rows = await repo.findDoctorWorkloadTrend(doctorId, range);

  return rows.map((r) => ({
    date: r.date,
    totalAppointments: r.totalAppointments,
  }));
};

export const getDoctorCompletionRate = async (
  doctorId: string,
  range?: RangeType
) => {
  return repo.findDoctorCompletionRate(doctorId, range);
};

export const getDoctorPatientTypes = async (
  doctorId: string,
  range?: RangeType
) => {
  return repo.findDoctorPatientTypes(doctorId, range);
};
