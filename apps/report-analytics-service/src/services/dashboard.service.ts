import * as repo from '../repositories/analytics.repository';

export const getCounters = async () => {
  const data = await repo.findTodayCounters();

  if (!data) {
    return {
      totalAppointments: 0,
      completedAppointments: 0,
      newPatients: 0,
      followUpsScheduled: 0,
    };
  }

  return {
    totalAppointments: data.totalAppointments,
    completedAppointments: data.completedAppointments,
    newPatients: data.newPatients,
    followUpsScheduled: data.followUpsScheduled,
  };
};

export const getAppointmentTrend = async () => {
  const data = await repo.findAppointmentTrend();

  return data.map((d) => ({
    date: d.date,
    totalAppointments: d.totalAppointments,
  }));
};

export const getDailyAnalytics = async (page: number, limit: number) => {
  return repo.findDailyAnalytics(page, limit);
};
