import { WhereOptions, Op } from 'sequelize';
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

export const createAppointment = (data: CreateAppointmentData) =>
  Appointment.create({
    ...data,
    status: 'requested',
    paymentStatus: 'pending',
  });

export const findAppointmentById = (id: string) => Appointment.findByPk(id);

export const updateAppointmentStatus = (
  appointment: Appointment,
  status: AppointmentStatus
) => appointment.update({ status });

export const updatePaymentStatus = (
  appointment: Appointment,
  paymentStatus: PaymentStatus
) => appointment.update({ paymentStatus });

export const findAppointmentsByPatient = (
  patientId: string,
  page: number,
  limit: number
) => {
  const offset = (page - 1) * limit;

  return Appointment.findAndCountAll({
    where: { patientId },
    include: [
      {
        model: Doctor,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'full_name', 'email'],
          },
        ],
      },
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
};

export const findAppointmentsByDoctor = (
  doctorId: string,
  page: number,
  limit: number
) => {
  const offset = (page - 1) * limit;

  return Appointment.findAndCountAll({
    where: { doctorId },
    include: [
      {
        model: Patient,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'full_name', 'email'],
          },
        ],
      },
      {
        model: DoctorSlot,
        as: 'slot',
        attributes: ['slotDate', 'startTime', 'endTime'],
      },
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
};
export const adminSearchAppointments = ({
  branchId,
  status,
  search,
  page,
  limit,
}: AdminSearchAppointmentsInput) => {
  const offset = (page - 1) * limit;

  const baseWhere: WhereOptions = {};

  if (branchId) {
    baseWhere.branchId = branchId;
  }

  if (status) {
    baseWhere.status = status;
  }

  const searchCondition: WhereOptions | undefined = search
    ? {
        [Op.or]: [
          { '$Doctor.user.full_name$': { [Op.iLike]: `%${search}%` } },
          { '$Doctor.user.email$': { [Op.iLike]: `%${search}%` } },
          { '$Patient.user.full_name$': { [Op.iLike]: `%${search}%` } },
          { '$Patient.user.email$': { [Op.iLike]: `%${search}%` } },
        ],
      }
    : undefined;

  const where: WhereOptions = searchCondition
    ? { ...baseWhere, ...searchCondition }
    : baseWhere;

  return Appointment.findAndCountAll({
    where,
    include: [
      {
        model: Doctor,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'full_name', 'email'],
          },
        ],
      },
      {
        model: Patient,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'full_name', 'email'],
          },
        ],
      },
      {
        model: DoctorSlot,
        as: 'slot',
        attributes: ['slotDate', 'startTime', 'endTime'],
      },
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
};

export const updateAppointmentSlot = (
  appointment: Appointment,
  slotId: string,
  status: string
) =>
  appointment.update({
    slotId,
    status,
  });
