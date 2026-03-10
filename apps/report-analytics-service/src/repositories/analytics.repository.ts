import { Op } from 'sequelize';
import { AnalyticsDaily } from '../models/analyticsDailyMetric.model';
import { Appointment } from '../models/external/appointment.model';
import { DoctorSlot } from '../models/external/doctorSlot.model';
import { Patient } from '../models/external/patient.model';
import { User } from '../models/external/user.model';

export const findTodayAnalytics = async () => {
  const today = new Date().toISOString().split('T')[0];

  return AnalyticsDaily.findOne({
    where: {
      date: today,
    },
  });
};

export const findAppointmentTrend = async (days: number) => {
  const start = new Date();
  start.setDate(start.getDate() - days);

  return AnalyticsDaily.findAll({
    attributes: ['date', 'totalAppointments'],
    where: {
      date: {
        [Op.gte]: start,
      },
    },
    order: [['date', 'ASC']],
  });
};

export const findDailyAnalytics = async (
  page: number,
  limit: number,
  from?: string,
  to?: string,
  sortBy = 'date',
  sortOrder: 'ASC' | 'DESC' = 'DESC'
) => {
  const offset = (page - 1) * limit;

  const where: {
    date?: {
      [Op.gte]?: Date;
      [Op.lte]?: Date;
    };
  } = {};

  if (from || to) {
    where.date = {};

    if (from) {
      where.date[Op.gte] = new Date(from);
    }

    if (to) {
      where.date[Op.lte] = new Date(to);
    }
  }

  return AnalyticsDaily.findAndCountAll({
    where,
    limit,
    offset,
    order: [[sortBy, sortOrder]],
  });
};

export const findDoctorCounters = async (doctorId: string) => {
  const today = new Date();

  const todayAppointments = await Appointment.count({
    where: { doctorId },
  });

  const completedAppointments = await Appointment.count({
    where: { doctorId, status: 'completed' },
  });

  const cancelledAppointments = await Appointment.count({
    where: { doctorId, status: 'cancelled' },
  });

  return {
    todayAppointments,
    completedAppointments,
    cancelledAppointments,
  };
};

export const findDoctorUpcoming = async (doctorId: string) => {
  return Appointment.findAll({
    where: { doctorId, status: 'confirmed' },
    include: [
      {
        model: Patient,
        as: 'patient',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['full_name'],
          },
        ],
      },
      {
        model: DoctorSlot,
        as: 'slot',
        attributes: ['slotDate', 'startTime'],
      },
    ],
    limit: 5,
  });
};

export const findPatientCounters = async (patientId: string) => {
  const upcomingAppointments = await Appointment.count({
    where: { patientId, status: 'confirmed' },
  });

  const completedAppointments = await Appointment.count({
    where: { patientId, status: 'completed' },
  });

  return {
    upcomingAppointments,
    completedAppointments,
  };
};

export const findPatientUpcoming = async (patientId: string) => {
  return Appointment.findAll({
    where: { patientId, status: 'confirmed' },
    include: [
      {
        model: DoctorSlot,
        as: 'slot',
        attributes: ['slotDate', 'startTime'],
      },
    ],
    limit: 5,
  });
};
