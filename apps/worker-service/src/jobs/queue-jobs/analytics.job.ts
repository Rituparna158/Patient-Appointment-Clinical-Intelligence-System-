import { Op } from 'sequelize';

import { Appointment } from '../../models';
import { Patient } from '../../models';
import { ConsultaionNote } from '../../models';

import { AnalyticsDaily } from '../../models/external/analyticsDailyMetric.model';

export const generateDailyAnalytics = async (date: string) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const appointments = await Appointment.findAll({
    where: {
      createdAt: {
        [Op.between]: [start, end],
      },
    },
  });

  let confirmed = 0;
  let cancelled = 0;
  let missed = 0;
  let completed = 0;

  for (const a of appointments) {
    if (a.status === 'confirmed') confirmed++;
    if (a.status === 'cancelled') cancelled++;
    if (a.status === 'missed') missed++;
    if (a.status === 'completed') completed++;
  }

  const uniquePatients: number = new Set(appointments.map((a) => a.patientId))
    .size;

  const newPatients: number = uniquePatients;

  const followUps: number = await ConsultaionNote.count({
    where: {
      followUpDate: {
        [Op.between]: [start, end],
      },
    },
  });

  await AnalyticsDaily.upsert({
    date: start,

    totalAppointments: appointments.length,

    confirmedAppointments: confirmed,

    cancelledAppointments: cancelled,

    missedAppointments: missed,

    completedAppointments: completed,

    totalRevenue: 0, // payment service not implemented yet

    avgConsultationFee: 0,

    newPatients,

    uniquePatients,

    followUpsScheduled: followUps,
  });
};
