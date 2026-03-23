import { Op } from 'sequelize';

import { Appointment } from '@repo/shared-database';
import { Doctor } from '@repo/shared-database';
import { Patient } from '@repo/shared-database';
import { User } from '@repo/shared-database';
import { DoctorSlot } from '@repo/shared-database';

export type RangeType = 'today' | 'week' | 'month' | 'year';

const resolveRange = (range?: RangeType) => {
  if (!range) return {};

  const now = new Date();

  if (range === 'today') {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  if (range === 'week') {
    const start = new Date();
    start.setDate(now.getDate() - 7);

    return { start, end: now };
  }

  if (range === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    return { start, end: now };
  }

  if (range === 'year') {
    const start = new Date(now.getFullYear(), 0, 1);

    return { start, end: now };
  }

  return {};
};

export const findAdminExportRows = async (
  range?: RangeType,
  from?: string,
  to?: string
) => {
  const dateFilter = resolveRange(range);

  const where: any = {};

  if (from && to) {
    where.createdAt = {
      [Op.between]: [new Date(from), new Date(to)],
    };
  } else if (dateFilter.start && dateFilter.end) {
    where.createdAt = {
      [Op.between]: [dateFilter.start, dateFilter.end],
    };
  }

  const appointments = await Appointment.findAll({
    where,

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
        model: Doctor,
        as: 'doctor',
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
  });

  const rows = appointments.map((a) => ({
    date: a.createdAt,

    doctorName: a.doctor?.user?.full_name ?? '',
    patientName: a.patient?.user?.full_name ?? '',

    appointmentStatus: a.status ?? '',

    slotDate: a.slot?.slotDate ?? '',
    startTime: a.slot?.startTime ?? '',

    totalAppointments: 1,

    completedAppointments: a.status === 'completed' ? 1 : 0,
    cancelledAppointments: a.status === 'cancelled' ? 1 : 0,
    missedAppointments: a.status === 'missed' ? 1 : 0,

    newPatients: 0,
    uniquePatients: 0,
    followUpsScheduled: 0,
  }));

  return rows;
};

export const findDoctorExportRows = async (doctorId: string) => {
  const appointments = await Appointment.findAll({
    where: { doctorId },

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
  });

  const rows = appointments.map((a) => ({
    appointmentId: a.id,

    patientName: a.patient?.user?.full_name ?? '',

    slotDate: a.slot?.slotDate ?? '',
    startTime: a.slot?.startTime ?? '',

    status: a.status ?? '',
  }));

  return rows;
};
