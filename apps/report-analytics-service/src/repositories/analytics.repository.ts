import { Op, Order, WhereOptions } from 'sequelize';
import { AnalyticsDaily } from '../models/analyticsDailyMetric.model';
import { Appointment } from '../models/external/appointment.model';
import { DoctorSlot } from '../models/external/doctorSlot.model';
import { Patient } from '../models/external/patient.model';
import { Doctor } from '../models/external/doctor.model';
import { User } from '../models/external/user.model';

import {
  CompletionRate,
  PatientTypeStats,
  RangeType,
  ResolvedRange,
  TableQueryOptions,
  WorkloadTrendRow,
} from '../types/dashboard.types';
import {
  buildDateWhere,
  resolveDateRange,
  startOfToday,
} from '../utils/date-range';
import { id } from 'zod/v4/locales';

export const findCounters = async (range?: RangeType) => {
  const dateFilter = buildDateWhere(undefined, undefined, range);
  const where: WhereOptions = {};
  if (dateFilter) where['date'] = dateFilter;
  return AnalyticsDaily.findAll({ where });
};

export const findAnalyticsRange = async (from: string, to: string) => {
  return AnalyticsDaily.findAll({
    where: {
      date: {
        [Op.between]: [from, to],
      },
    },
  });
};

export const findAppointmentStatus = async (range?: RangeType) => {
  const dateFilter = buildDateWhere(undefined, undefined, range);
  const where: WhereOptions = {};
  if (dateFilter) where['date'] = dateFilter;
  return AnalyticsDaily.findAll({
    attributes: [
      'confirmedAppointments',
      'completedAppointments',
      'cancelledAppointments',
      'missedAppointments',
    ],
    where,
  });
};

export const findAppointmentTrend = async (range?: RangeType) => {
  const dateFilter = buildDateWhere(undefined, undefined, range);
  const where: WhereOptions = {};
  if (dateFilter) where['date'] = dateFilter;
  return AnalyticsDaily.findAll({
    attributes: ['date', 'totalAppointments'],
    where,
    order: [['date', 'ASC']],
  });
};

export const findDailyAnalytics = async (
  page: number,
  limit: number,
  options: TableQueryOptions
) => {
  const offset = (page - 1) * limit;
  const where: WhereOptions = {};
  const dateFilter = buildDateWhere(options.from, options.to, options.range);
  if (dateFilter) where['date'] = dateFilter;
  const sortBy = options.sortBy ?? 'date';
  const sortOrder = options.sortOrder ?? 'DESC';
  return AnalyticsDaily.findAndCountAll({
    where,
    limit,
    offset,
    order: [[sortBy, sortOrder]],
  });
};

export const findDoctorCounters = async (doctorId: string) => {
  const today = startOfToday();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const todayAppointments = await Appointment.count({
    where: { doctorId },
    include: [
      {
        model: DoctorSlot,
        as: 'slot',
        where: {
          slotDate: {
            [Op.between]: [today, tomorrow],
          },
        },
      },
    ],
  });

  const completedAppointments = await Appointment.count({
    where: {
      doctorId,
      status: 'completed',
    },
  });

  const cancelledAppointments = await Appointment.count({
    where: {
      doctorId,
      status: 'cancelled',
    },
  });

  return {
    todayAppointments,
    completedAppointments,
    cancelledAppointments,
  };
};

export const findDoctorUpcomingAppointments = async (doctorId: string) => {
  const today = startOfToday();
  return Appointment.findAll({
    where: {
      doctorId,
      status: {
        [Op.in]: ['requested', 'confirmed'],
      },
    },
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
        where: {
          slotDate: {
            [Op.gte]: today,
          },
        },
      },
    ],
    order: [[{ model: DoctorSlot, as: 'slot' }, 'slotDate', 'ASC']],
    limit: 5,
  });
};

export const findDoctorAppointmentsTable = async (
  doctorId: string,
  page: number,
  limit: number,
  from?: string,
  to?: string,
  sortBy: 'slotDate' | 'status' = 'slotDate',
  sortOrder: 'ASC' | 'DESC' = 'ASC'
) => {
  const offset = (page - 1) * limit;
  const slotWhere: any = {};

  if (from) slotWhere[Op.gte] = new Date(from);
  if (to) slotWhere[Op.lte] = new Date(to);

  const order: Order =
    sortBy === 'slotDate'
      ? [[{ model: DoctorSlot, as: 'slot' }, 'slotDate', sortOrder]]
      : [['status', sortOrder]];
  return Appointment.findAndCountAll({
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
        where: Object.keys(slotWhere).length
          ? { slotDate: slotWhere }
          : undefined,
      },
    ],
    limit,
    offset,
    order,
  });
};

export const findPatientCounters = async (patientId: string) => {
  const today = startOfToday();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const upcomingAppointments = await Appointment.count({
    where: {
      patientId,
      status: {
        [Op.in]: ['requested', 'confirmed'],
      },
    },
  });
  const completedAppointments = await Appointment.count({
    where: {
      patientId,
      status: 'completed',
    },
  });
  return {
    upcomingAppointments,
    completedAppointments,
  };
};

export const findPatientUpcomingAppointments = async (patientId: string) => {
  const today = startOfToday();
  return Appointment.findAll({
    where: {
      patientId,
      status: {
        [Op.in]: ['requested', 'confirmed'],
      },
    },
    include: [
      {
        model: DoctorSlot,
        as: 'slot',
        attributes: ['slotDate', 'startTime'],
        where: {
          slotDate: {
            [Op.gte]: today,
          },
        },
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
    ],
    order: [[{ model: DoctorSlot, as: 'slot' }, 'slotDate', 'ASC']],
    limit: 5,
  });
};

export const findPatientAppointmentsTable = async (
  patientId: string,
  page: number,
  limit: number,
  from?: string,
  to?: string,
  sortBy: 'slotDate' | 'status' = 'slotDate',
  sortOrder: 'ASC' | 'DESC' = 'ASC'
) => {
  const offset = (page - 1) * limit;
  const slotWhere: any = {};
  if (from) slotWhere[Op.gte] = new Date(from);

  if (to) slotWhere[Op.lte] = new Date(to);
  const order: Order =
    sortBy === 'slotDate'
      ? [[{ model: DoctorSlot, as: 'slot' }, 'slotDate', sortOrder]]
      : [['status', sortOrder]];

  return Appointment.findAndCountAll({
    where: { patientId },
    include: [
      {
        model: DoctorSlot,
        as: 'slot',
        attributes: ['slotDate', 'startTime'],
        where: Object.keys(slotWhere).length
          ? { slotDate: slotWhere }
          : undefined,
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
    ],
    limit,
    offset,
    order,
  });
};

export const findDoctorWorkloadTrend = async (
  doctorId: string,
  range?: RangeType
): Promise<WorkloadTrendRow[]> => {
  const resolved = resolveDateRange(range);

  const slotWhere: any = {};

  if (resolved.start && resolved.end) {
    slotWhere.slotDate = {
      [Op.between]: [resolved.start, resolved.end],
    };
  }

  const appointments = await Appointment.findAll({
    where: { doctorId },
    include: [
      {
        model: DoctorSlot,
        as: 'slot',
        attributes: ['slotDate'],
        where: Object.keys(slotWhere).length ? slotWhere : undefined,
      },
    ],
  });

  const map = new Map<string, number>();

  appointments.forEach((a) => {
    const slotDate = a.slot?.slotDate;
    if (!slotDate) return;

    const key = new Date(slotDate).toISOString().split('T')[0];

    map.set(key, (map.get(key) ?? 0) + 1);
  });

  const rows: WorkloadTrendRow[] = [];

  map.forEach((count, date) => {
    rows.push({
      date: new Date(date),
      totalAppointments: count,
    });
  });

  rows.sort((a, b) => a.date.getTime() - b.date.getTime());

  return rows;
};
export const findDoctorCompletionRate = async (
  doctorId: string,
  range?: RangeType
): Promise<CompletionRate> => {
  const resolved = resolveDateRange(range);

  const where: any = { doctorId };

  if (resolved.start && resolved.end) {
    where.createdAt = {
      [Op.between]: [resolved.start, resolved.end],
    };
  }
  const appointments = await Appointment.findAll({ where });

  let completed = 0;
  let pending = 0;
  let cancelled = 0;

  appointments.forEach((a) => {
    if (a.status === 'completed') {
      completed++;
    } else if (a.status === 'cancelled') {
      cancelled++;
    } else {
      pending++;
    }
  });
  return {
    completed,
    pending,
    cancelled,
  };
};

export const findDoctorPatientTypes = async (
  doctorId: string,
  range?: RangeType
): Promise<PatientTypeStats> => {
  const resolved = resolveDateRange(range);

  const where: any = { doctorId };

  if (resolved.start && resolved.end) {
    where.createdAt = {
      [Op.between]: [resolved.start, resolved.end],
    };
  }
  const appointments = await Appointment.findAll({ where });

  const uniquePatients = new Set<string>();
  let returningPatients = 0;

  appointments.forEach((a) => {
    if (uniquePatients.has(a.patientId)) {
      returningPatients++;
    }
    uniquePatients.add(a.patientId);
  });

  return {
    newPatients: uniquePatients.size,
    returningPatients,
  };
};
