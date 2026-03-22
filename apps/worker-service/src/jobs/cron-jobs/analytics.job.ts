import { Op } from 'sequelize';
import {
  Appointment,
  ConsultaionNote,
  User,
  Role,
  AnalyticsDaily,
  DoctorSlot,
} from '@repo/shared-database';
import { logger } from '@repo/shared-utils';

export const generateDailyAnalytics = async () => {
  try {
    const todayStr = new Date().toLocaleDateString('en-CA', {
      timeZone: 'Asia/Kolkata',
    });

    const start = new Date(`${todayStr}T00:00:00+05:30`);
    const end = new Date(`${todayStr}T23:59:59+05:30`);

    const appointments = await Appointment.findAll({
      include: [
        {
          model: DoctorSlot,
          as: 'slot',
          attributes: ['slotDate'],
          where: {
            slotDate: {
              [Op.eq]: todayStr,
            },
          },
        },
      ],
    });

    const totalAppointments = appointments.length;

    let confirmedAppointments = 0;
    let completedAppointments = 0;
    let cancelledAppointments = 0;
    let missedAppointments = 0;

    const patientSet = new Set<string>();

    appointments.forEach((a) => {
      if (a.status === 'confirmed') confirmedAppointments++;
      else if (a.status === 'completed') completedAppointments++;
      else if (a.status === 'cancelled') cancelledAppointments++;
      else if (a.status === 'missed') missedAppointments++;

      if (a.patientId) patientSet.add(a.patientId);
    });

    const uniquePatients = patientSet.size;

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
      date: todayStr,
      branchId: null,
      doctorId: null,

      totalAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      missedAppointments,

      totalRevenue: 0,
      avgConsultationFee: 0,

      newPatients,
      uniquePatients,
      followUpsScheduled,
    });
  } catch (error) {
    logger.error({ error });
  }
};
