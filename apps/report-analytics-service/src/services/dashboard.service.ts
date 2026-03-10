import * as repo from '../repositories/analytics.repository';

export const getDashboardCounters = async () => {
  const data = await repo.findTodayAnalytics();

  // if (!data) {
  //   return {
  //     totalAppointments: 0,
  //     completedAppointments: 0,
  //     newPatients: 0,
  //     followUpsScheduled: 0,
  //   };
  // }

  return {
    totalAppointments: data?.totalAppointments ?? 0,
    completedAppointments: data?.completedAppointments ?? 0,
    newPatients: data?.newPatients ?? 0,
    followUpsScheduled: data?.followUpsScheduled ?? 0,
  };
};

export const getAppointmentStatus = async () => {
  const row = await repo.findTodayAnalytics();

  return {
    confirmedAppointments: row?.confirmedAppointments ?? 0,
    completedAppointments: row?.completedAppointments ?? 0,
    cancelledAppointments: row?.cancelledAppointments ?? 0,
    missedAppointments: row?.missedAppointments ?? 0,
  };
};

export const getAppointmentTrend = async (days: number) => {
  const data = await repo.findAppointmentTrend(days);

  return data.map((d) => ({
    date: d.date,
    totalAppointments: d.totalAppointments,
  }));
};

export const getDailyAnalytics = async (
  page: number,
  limit: number,
  from?: string,
  to?: string,
  sortBy?: string,
  sortOrder?: 'ASC' | 'DESC'
) => {
  return repo.findDailyAnalytics(page, limit, from, to, sortBy, sortOrder);
};

export const getDoctorDashboard = async (doctorId: string) => {
  const counters = await repo.findDoctorCounters(doctorId);
  const upcoming = await repo.findDoctorUpcoming(doctorId);

  return {
    counters,
    upcoming,
  };
};

export const getPatientDashboard = async (patientId: string) => {
  const counters = await repo.findPatientCounters(patientId);
  const upcoming = await repo.findPatientUpcoming(patientId);

  return {
    counters,
    upcoming,
  };
};
