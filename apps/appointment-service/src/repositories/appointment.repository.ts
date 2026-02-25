import { WhereOptions } from 'sequelize';
import { Appointment } from '../models/appointment.model';
import {
  CreateAppointmentData,
  AppointmentStatus,
  PaymentStatus,
  AdminSearchAppointmentsInput,
} from '../types/appointment.types';
import { Doctor } from '../models';
import { User } from '../models/external/user.model';

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
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
};

export const adminSearchAppointments = ({
  branchId,
  status,
  page,
  limit,
}: AdminSearchAppointmentsInput) => {
  const offset = (page - 1) * limit;

  const where: WhereOptions = {};

  if (branchId) {
    where.branchId = branchId;
  }

  if (status) {
    where.status = status;
  }

  return Appointment.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
};
