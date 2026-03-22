import { FindOptions, Op, Order, Transaction, WhereOptions } from 'sequelize';
import {
  Appointment,
  Doctor,
  DoctorSlot,
  Patient,
  User,
} from '@repo/shared-database';
import {
  AdminSearchAppointmentsInput,
  AppointmentStatus,
  CreateAppointmentData,
  PaymentStatus,
  RepositoryLockOptions,
  RepositoryOptions,
} from '../types/appointment.types';

function buildSort(sortBy: string, sortOrder: 'ASC' | 'DESC'): Order {
  if (sortBy === 'doctor') {
    return [
      [
        { model: Doctor, as: 'doctor' },
        { model: User, as: 'user' },
        'full_name',
        sortOrder,
      ],
    ];
  }

  if (sortBy === 'patient') {
    return [
      [
        { model: Patient, as: 'patient' },
        { model: User, as: 'user' },
        'full_name',
        sortOrder,
      ],
    ];
  }

  if (sortBy === 'date') {
    return [[{ model: DoctorSlot, as: 'slot' }, 'slotDate', sortOrder]];
  }

  if (sortBy === 'time') {
    return [[{ model: DoctorSlot, as: 'slot' }, 'startTime', sortOrder]];
  }

  if (sortBy === 'status') {
    return [['status', sortOrder]];
  }

  return [['createdAt', sortOrder]];
}

function buildInclude(fromDate?: string, toDate?: string) {
  const slotInclude: {
    model: typeof DoctorSlot;
    as: 'slot';
    attributes: [
      'id',
      'doctorId',
      'branchId',
      'slotDate',
      'startTime',
      'endTime',
      'isBooked',
      'isActive',
    ];
    required: boolean;
    where?: WhereOptions;
  } = {
    model: DoctorSlot,
    as: 'slot',
    attributes: [
      'id',
      'doctorId',
      'branchId',
      'slotDate',
      'startTime',
      'endTime',
      'isBooked',
      'isActive',
    ],
    required: false,
  };

  if (fromDate || toDate) {
    const slotDateFilter: {
      [Op.gte]?: Date;
      [Op.lte]?: Date;
    } = {};

    if (fromDate && !Number.isNaN(Date.parse(fromDate))) {
      slotDateFilter[Op.gte] = new Date(fromDate);
    }

    if (toDate && !Number.isNaN(Date.parse(toDate))) {
      slotDateFilter[Op.lte] = new Date(toDate);
    }

    if (Object.keys(slotDateFilter).length > 0) {
      slotInclude.where = {
        slotDate: slotDateFilter,
      };
    }
  }

  return [
    {
      model: Doctor,
      as: 'doctor',
      required: false,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email'],
          required: false,
        },
      ],
    },
    {
      model: Patient,
      as: 'patient',
      required: false,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email'],
          required: false,
        },
      ],
    },
    slotInclude,
  ];
}

export const createAppointment = async (
  data: CreateAppointmentData,
  options: RepositoryOptions = {}
) => {
  const appointment = await Appointment.create(
    {
      ...data,
      status: 'requested',
      paymentStatus: 'pending',
    },
    {
      transaction: options.transaction,
    }
  );

  return Appointment.findByPk(appointment.id, {
    include: buildInclude(),
    transaction: options.transaction,
  });
};

export const findAppointmentById = (
  id: string,
  options: RepositoryOptions = {}
) =>
  Appointment.findByPk(id, {
    include: buildInclude(),
    transaction: options.transaction,
  });

export const findAppointmentByIdForUpdate = (
  id: string,
  options: RepositoryLockOptions = {}
) =>
  Appointment.findByPk(id, {
    transaction: options.transaction,
    lock: options.lock,
  });

export const updateAppointmentStatus = (
  appointment: Appointment,
  status: AppointmentStatus,
  options: RepositoryOptions = {}
) =>
  appointment.update(
    { status },
    {
      transaction: options.transaction,
    }
  );

export const updatePaymentStatus = (
  appointment: Appointment,
  paymentStatus: PaymentStatus,
  options: RepositoryOptions = {}
) =>
  appointment.update(
    { paymentStatus },
    {
      transaction: options.transaction,
    }
  );

export const findAppointmentsByPatient = async (
  patientId: string,
  page: number,
  limit: number,
  search?: string,
  status?: string,
  fromDate?: string,
  toDate?: string,
  sortBy = 'createdAt',
  sortOrder: 'ASC' | 'DESC' = 'DESC'
) => {
  const offset = (page - 1) * limit;

  const baseWhere: WhereOptions = { patientId };

  if (status) {
    baseWhere['status'] = status;
  }

  const searchCondition: WhereOptions = search
    ? {
        [Op.or]: [
          {
            '$doctor.user.full_name$': {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      }
    : {};

  const order = buildSort(sortBy, sortOrder);

  return Appointment.findAndCountAll({
    where: {
      ...baseWhere,
      ...searchCondition,
    },
    include: buildInclude(fromDate, toDate),
    limit,
    offset,
    order,
    subQuery: false,
  });
};

export const findAppointmentsByDoctor = async (
  doctorId: string,
  page: number,
  limit: number,
  search?: string,
  status?: string,
  fromDate?: string,
  toDate?: string,
  sortBy = 'createdAt',
  sortOrder: 'ASC' | 'DESC' = 'DESC'
) => {
  const offset = (page - 1) * limit;

  const baseWhere: WhereOptions = { doctorId };

  if (status) {
    baseWhere['status'] = status;
  }

  const searchCondition: WhereOptions = search
    ? {
        [Op.or]: [
          {
            '$patient.user.full_name$': {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            appointmentReason: {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      }
    : {};

  const order = buildSort(sortBy, sortOrder);

  return Appointment.findAndCountAll({
    where: {
      ...baseWhere,
      ...searchCondition,
    },
    include: buildInclude(fromDate, toDate),
    limit,
    offset,
    order,
    subQuery: false,
  });
};

export const adminSearchAppointments = ({
  branchId,
  status,
  search,
  page,
  limit,
  sortBy = 'createdAt',
  sortOrder = 'DESC',
  fromDate,
  toDate,
}: AdminSearchAppointmentsInput & {
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  fromDate?: string;
  toDate?: string;
}) => {
  const offset = (page - 1) * limit;

  const baseWhere: WhereOptions = {};

  if (branchId) {
    baseWhere['branchId'] = branchId;
  }

  if (status) {
    baseWhere['status'] = status;
  }

  const searchCondition: WhereOptions = search
    ? {
        [Op.or]: [
          {
            '$doctor.user.full_name$': {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            '$patient.user.full_name$': {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      }
    : {};

  const order = buildSort(sortBy, sortOrder);

  return Appointment.findAndCountAll({
    where: {
      ...baseWhere,
      ...searchCondition,
    },
    include: buildInclude(fromDate, toDate),
    limit,
    offset,
    order,
    subQuery: false,
  });
};

export const updateAppointmentSlot = (
  appointment: Appointment,
  slotId: string,
  status: AppointmentStatus,
  options: RepositoryOptions = {}
) =>
  appointment.update(
    { slotId, status },
    {
      transaction: options.transaction,
    }
  );
