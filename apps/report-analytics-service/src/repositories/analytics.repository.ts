import { Op, Order, WhereOptions, fn, col, literal, cast } from 'sequelize';
import { AnalyticsDaily } from '@repo/shared-database';
import { Appointment } from '@repo/shared-database';
import { DoctorSlot } from '@repo/shared-database';
import { Patient } from '@repo/shared-database';
import { Doctor } from '@repo/shared-database';
import { User } from '@repo/shared-database';

import {
  CompletionRate,
  PatientTypeStats,
  RangeType,
  TableQueryOptions,
  WorkloadTrendRow,
} from '../types/dashboard.types';
import {
  buildDateWhere,
  resolveDateRange,
  startOfToday,
} from '../utils/date-range';

type WorkloadTrendAggregateRow = {
  date: string;
  totalAppointments: string | number;
};

type DoctorPatientTypeAggregateRow = {
  patientId: string;
  visitCount: string | number;
};

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

  const [statusCounts, todayAppointments] = await Promise.all([
    Appointment.findOne({
      where: { doctorId },
      attributes: [
        [
          fn(
            'SUM',
            literal(`CASE WHEN status = 'completed' THEN 1 ELSE 0 END`)
          ),
          'completedAppointments',
        ],
        [
          fn(
            'SUM',
            literal(`CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END`)
          ),
          'cancelledAppointments',
        ],
      ],
      raw: true,
    }),
    Appointment.count({
      where: { doctorId },
      include: [
        {
          model: DoctorSlot,
          as: 'slot',
          attributes: [],
          required: true,
          where: {
            slotDate: {
              [Op.between]: [today, tomorrow],
            },
          },
        },
      ],
    }),
  ]);

  return {
    todayAppointments,
    completedAppointments: Number(
      (statusCounts as { completedAppointments?: string | number } | null)
        ?.completedAppointments ?? 0
    ),
    cancelledAppointments: Number(
      (statusCounts as { cancelledAppointments?: string | number } | null)
        ?.cancelledAppointments ?? 0
    ),
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
    attributes: ['id', 'status'],
    include: [
      {
        model: Patient,
        as: 'patient',
        attributes: ['id'],
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
        required: true,
        where: {
          slotDate: {
            [Op.gte]: today,
          },
        },
      },
    ],
    order: [
      [{ model: DoctorSlot, as: 'slot' }, 'slotDate', 'ASC'],
      [{ model: DoctorSlot, as: 'slot' }, 'startTime', 'ASC'],
    ],
    limit: 5,
    subQuery: false,
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
  const slotDateWhere: Record<symbol, Date> = {} as Record<symbol, Date>;

  if (from) slotDateWhere[Op.gte] = new Date(from);
  if (to) slotDateWhere[Op.lte] = new Date(to);

  const order: Order =
    sortBy === 'slotDate'
      ? [
          [{ model: DoctorSlot, as: 'slot' }, 'slotDate', sortOrder],
          [{ model: DoctorSlot, as: 'slot' }, 'startTime', sortOrder],
        ]
      : [['status', sortOrder]];

  return Appointment.findAndCountAll({
    where: { doctorId },
    attributes: [
      'id',
      'status',
      'doctorId',
      'patientId',
      'slotId',
      'createdAt',
    ],
    include: [
      {
        model: Patient,
        as: 'patient',
        attributes: ['id'],
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
        required: Object.keys(slotDateWhere).length > 0,
        where:
          Object.keys(slotDateWhere).length > 0
            ? { slotDate: slotDateWhere }
            : undefined,
      },
    ],
    distinct: true,
    limit,
    offset,
    order,
    subQuery: false,
  });
};

export const findPatientCounters = async (patientId: string) => {
  const counters = await Appointment.findOne({
    where: { patientId },
    attributes: [
      [
        fn(
          'SUM',
          literal(
            `CASE WHEN status IN ('requested', 'confirmed') THEN 1 ELSE 0 END`
          )
        ),
        'upcomingAppointments',
      ],
      [
        fn('SUM', literal(`CASE WHEN status = 'completed' THEN 1 ELSE 0 END`)),
        'completedAppointments',
      ],
    ],
    raw: true,
  });

  return {
    upcomingAppointments: Number(
      (counters as { upcomingAppointments?: string | number } | null)
        ?.upcomingAppointments ?? 0
    ),
    completedAppointments: Number(
      (counters as { completedAppointments?: string | number } | null)
        ?.completedAppointments ?? 0
    ),
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
    attributes: ['id', 'status'],
    include: [
      {
        model: DoctorSlot,
        as: 'slot',
        attributes: ['slotDate', 'startTime'],
        required: true,
        where: {
          slotDate: {
            [Op.gte]: today,
          },
        },
      },
      {
        model: Doctor,
        as: 'doctor',
        attributes: ['id'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['full_name'],
          },
        ],
      },
    ],
    order: [
      [{ model: DoctorSlot, as: 'slot' }, 'slotDate', 'ASC'],
      [{ model: DoctorSlot, as: 'slot' }, 'startTime', 'ASC'],
    ],
    limit: 5,
    subQuery: false,
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
  const slotDateWhere: Record<symbol, Date> = {} as Record<symbol, Date>;

  if (from) slotDateWhere[Op.gte] = new Date(from);
  if (to) slotDateWhere[Op.lte] = new Date(to);

  const order: Order =
    sortBy === 'slotDate'
      ? [
          [{ model: DoctorSlot, as: 'slot' }, 'slotDate', sortOrder],
          [{ model: DoctorSlot, as: 'slot' }, 'startTime', sortOrder],
        ]
      : [['status', sortOrder]];

  return Appointment.findAndCountAll({
    where: { patientId },
    attributes: [
      'id',
      'status',
      'doctorId',
      'patientId',
      'slotId',
      'createdAt',
    ],
    include: [
      {
        model: DoctorSlot,
        as: 'slot',
        attributes: ['slotDate', 'startTime'],
        required: Object.keys(slotDateWhere).length > 0,
        where:
          Object.keys(slotDateWhere).length > 0
            ? { slotDate: slotDateWhere }
            : undefined,
      },
      {
        model: Doctor,
        as: 'doctor',
        attributes: ['id'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['full_name'],
          },
        ],
      },
    ],
    distinct: true,
    limit,
    offset,
    order,
    subQuery: false,
  });
};

export const findDoctorWorkloadTrend = async (
  doctorId: string,
  range?: RangeType
): Promise<WorkloadTrendRow[]> => {
  const resolved = resolveDateRange(range);
  const slotWhere: WhereOptions = {};

  if (resolved.start && resolved.end) {
    slotWhere['slotDate'] = {
      [Op.between]: [resolved.start, resolved.end],
    };
  }

  const rows = await Appointment.findAll({
    where: { doctorId },
    attributes: [
      [col('slot.slotDate'), 'date'],
      [fn('COUNT', col('Appointment.id')), 'totalAppointments'],
    ],
    include: [
      {
        model: DoctorSlot,
        as: 'slot',
        attributes: [],
        required: true,
        where: Object.keys(slotWhere).length ? slotWhere : undefined,
      },
    ],
    group: [col('slot.slotDate')],
    order: [[col('slot.slotDate'), 'ASC']],
    raw: true,
  });

  const typedRows = rows as unknown as WorkloadTrendAggregateRow[];

  return typedRows.map((row) => ({
    date: new Date(row.date),
    totalAppointments: Number(row.totalAppointments),
  }));
};

export const findDoctorPatientTypes = async (
  doctorId: string,
  range?: RangeType
): Promise<PatientTypeStats> => {
  const resolved = resolveDateRange(range);
  const where: WhereOptions = { doctorId };

  if (resolved.start && resolved.end) {
    where['createdAt'] = {
      [Op.between]: [resolved.start, resolved.end],
    };
  }

  const rows = await Appointment.findAll({
    where,
    attributes: ['patientId', [fn('COUNT', col('id')), 'visitCount']],
    group: ['patientId'],
    raw: true,
  });

  const typedRows = rows as unknown as DoctorPatientTypeAggregateRow[];

  let newPatients = 0;
  let returningPatients = 0;

  for (const row of typedRows) {
    const visitCount = Number(row.visitCount);

    newPatients += 1;

    if (visitCount > 1) {
      returningPatients += 1;
    }
  }

  return {
    newPatients,
    returningPatients,
  };
};

export const findDoctorCompletionRate = async (
  doctorId: string,
  range?: RangeType
): Promise<CompletionRate> => {
  const resolved = resolveDateRange(range);
  const where: WhereOptions = { doctorId };

  if (resolved.start && resolved.end) {
    where['createdAt'] = {
      [Op.between]: [resolved.start, resolved.end],
    };
  }

  const result = await Appointment.findOne({
    where,
    attributes: [
      [
        fn('SUM', literal(`CASE WHEN status = 'completed' THEN 1 ELSE 0 END`)),
        'completed',
      ],
      [
        fn('SUM', literal(`CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END`)),
        'cancelled',
      ],
      [
        fn(
          'SUM',
          literal(
            `CASE WHEN status NOT IN ('completed', 'cancelled') THEN 1 ELSE 0 END`
          )
        ),
        'pending',
      ],
    ],
    raw: true,
  });

  const row = result as unknown as {
    completed?: string | number;
    cancelled?: string | number;
    pending?: string | number;
  } | null;

  return {
    completed: Number(row?.completed ?? 0),
    cancelled: Number(row?.cancelled ?? 0),
    pending: Number(row?.pending ?? 0),
  };
};
