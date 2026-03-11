import { Op } from 'sequelize';

import { Appointment } from '../../models/external/appointment.model';
import { ConsultaionNote } from '../../models/external/consultationNote.model';
import { User } from '../../models/external/user.model';
import { Role } from '../../models/external/role.model';

import { AnalyticsDaily } from '../../models/external/analyticsDailyMetric.model';

export const generateDailyAnalytics = async () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const appointments = await Appointment.findAll({
    where: {
      createdAt: {
        [Op.between]: [start, end],
      },
    },
  });

  const totalAppointments = appointments.length;

  const confirmedAppointments = appointments.filter(
    (a) => a.status === 'confirmed'
  ).length;

  const completedAppointments = appointments.filter(
    (a) => a.status === 'completed'
  ).length;

  const cancelledAppointments = appointments.filter(
    (a) => a.status === 'cancelled'
  ).length;

  const missedAppointments = appointments.filter(
    (a) => a.status === 'missed'
  ).length;

  const uniquePatients = new Set(appointments.map((a) => a.patientId)).size;

  const followUpsScheduled = await ConsultaionNote.count({
    where: {
      createdAt: {
        [Op.between]: [start, end],
      },
      followUpDate: {
        [Op.not]: null,
      },
    },
  });

  const newPatients = await User.count({
    include: [
      {
        model: Role,
        as: 'roles',
        where: { name: 'patient' },
        attributes: [],
      },
    ],
    where: {
      createdAt: {
        [Op.between]: [start, end],
      },
    },
  });

  await AnalyticsDaily.upsert({
    date: today,
    totalAppointments,
    confirmedAppointments,
    completedAppointments,
    cancelledAppointments,
    missedAppointments,
    newPatients,
    uniquePatients,
    totalRevenue: 0,
    avgConsultationFee: 0,
    followUpsScheduled,
  });

  console.log('Daily analytics generated:', today);
};
