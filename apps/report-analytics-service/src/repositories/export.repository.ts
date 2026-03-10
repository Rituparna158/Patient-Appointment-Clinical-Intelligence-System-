import { Op } from 'sequelize';
import { AnalyticsDaily } from '../models/analyticsDailyMetric.model';
import { CSVRow } from '../types/export.types';

export const findExportRows = async (from?: string, to?: string) => {
  const where: {
    date?: {
      [Op.between]: [string, string];
    };
  } = {};

  if (from && to) {
    where.date = {
      [Op.between]: [from, to],
    };
  }

  const rows = await AnalyticsDaily.findAll({
    where,
    order: [['date', 'DESC']],
  });

  const result: CSVRow[] = rows.map((r) => ({
    date: r.date,
    totalAppointments: r.totalAppointments,
    completedAppointments: r.completedAppointments,
    cancelledAppointments: r.cancelledAppointments,
    missedAppointments: r.missedAppointments,
    newPatients: r.newPatients,
    uniquePatients: r.uniquePatients,
    followUpsScheduled: r.followUpsScheduled,
  }));

  return result;
};
