import { WhereOptions, Op, Order } from 'sequelize';
import { Appointment } from '../models/appointment.model';
import {
  CreateAppointmentData,
  AppointmentStatus,
  PaymentStatus,
  AdminSearchAppointmentsInput,
} from '../types/appointment.types';

import { Doctor, DoctorSlot } from '../models';
import { User } from '../models/external/user.model';
import { Patient } from '../models/external/patient.model';

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

/* ---------------- BASE INCLUDE ---------------- */

function buildInclude(fromDate?: string, toDate?: string) {
  const slotInclude: {
    model: typeof DoctorSlot;
    as: string;
    attributes: string[];
    required: boolean;
    where?: WhereOptions;
  } = {
    model: DoctorSlot,
    as: 'slot',
    attributes: ['slotDate', 'startTime', 'endTime'],
    required: false,
  };

  if (fromDate || toDate) {
    const slotWhere: WhereOptions = {};

    if (fromDate && !isNaN(Date.parse(fromDate))) {
      slotWhere['slotDate'] = {
        ...(slotWhere['slotDate'] || {}),
        [Op.gte]: new Date(fromDate),
      };
    }

    if (toDate && !isNaN(Date.parse(toDate))) {
      slotWhere['slotDate'] = {
        ...(slotWhere['slotDate'] || {}),
        [Op.lte]: new Date(toDate),
      };
    }

    slotInclude.where = slotWhere;
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

/* ---------------- CREATE ---------------- */

export const createAppointment = async (data: CreateAppointmentData) => {
  const appointment = await Appointment.create({
    ...data,
    status: 'requested',
    paymentStatus: 'pending',
  });

  return Appointment.findByPk(appointment.id, {
    include: buildInclude(),
  });
};

/* ---------------- FIND BY ID ---------------- */

export const findAppointmentById = (id: string) =>
  Appointment.findByPk(id, {
    include: buildInclude(),
  });

/* ---------------- UPDATE STATUS ---------------- */

export const updateAppointmentStatus = (
  appointment: Appointment,
  status: AppointmentStatus
) => appointment.update({ status });

/* ---------------- UPDATE PAYMENT ---------------- */

export const updatePaymentStatus = (
  appointment: Appointment,
  paymentStatus: PaymentStatus
) => appointment.update({ paymentStatus });

/* ---------------- PATIENT APPOINTMENTS ---------------- */

export const findAppointmentsByPatient = async (
  patientId: string,
  page: number,
  limit: number,
  search?: string,
  status?: string,
  fromDate?: string,
  toDate?: string,
  sortBy: string = 'createdAt',
  sortOrder: 'ASC' | 'DESC' = 'DESC'
) => {
  const offset = (page - 1) * limit;

  const baseWhere: WhereOptions = { patientId };

  if (status) {
    baseWhere['status'] = status;
  }

  const searchCondition = search
    ? {
        [Op.or]: [
          { '$doctor.user.full_name$': { [Op.iLike]: `%${search}%` } },
          //{ appointmentReason: { [Op.iLike]: `%${search}%` } }
        ],
      }
    : {};

  const order = buildSort(sortBy, sortOrder);

  return Appointment.findAndCountAll({
    where: { ...baseWhere, ...searchCondition },

    include: buildInclude(fromDate, toDate),

    limit,
    offset,
    order,

    subQuery: false,
  });
};

/* ---------------- DOCTOR APPOINTMENTS ---------------- */

export const findAppointmentsByDoctor = async (
  doctorId: string,
  page: number,
  limit: number,
  search?: string,
  status?: string,
  fromDate?: string,
  toDate?: string,
  sortBy: string = 'createdAt',
  sortOrder: 'ASC' | 'DESC' = 'DESC'
) => {
  const offset = (page - 1) * limit;

  const baseWhere: WhereOptions = { doctorId };

  if (status) {
    baseWhere['status'] = status;
  }

  const searchCondition = search
    ? {
        [Op.or]: [
          { '$patient.user.full_name$': { [Op.iLike]: `%${search}%` } },
          { appointmentReason: { [Op.iLike]: `%${search}%` } },
        ],
      }
    : {};

  const order = buildSort(sortBy, sortOrder);

  return Appointment.findAndCountAll({
    where: { ...baseWhere, ...searchCondition },

    include: buildInclude(fromDate, toDate),

    limit,
    offset,
    order,

    subQuery: false,
  });
};

/* ---------------- ADMIN SEARCH ---------------- */

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

  if (branchId) baseWhere['branchId'] = branchId;
  if (status) baseWhere['status'] = status;

  const searchCondition = search
    ? {
        [Op.or]: [
          { '$doctor.user.full_name$': { [Op.iLike]: `%${search}%` } },
          { '$patient.user.full_name$': { [Op.iLike]: `%${search}%` } },
        ],
      }
    : {};

  const order = buildSort(sortBy, sortOrder);

  return Appointment.findAndCountAll({
    where: { ...baseWhere, ...searchCondition },

    include: buildInclude(fromDate, toDate),

    limit,
    offset,
    order,

    subQuery: false,
  });
};

/* ---------------- RESCHEDULE ---------------- */

export const updateAppointmentSlot = (
  appointment: Appointment,
  slotId: string,
  status: string
) => appointment.update({ slotId, status });
