import { isBefore, startOfDay } from 'date-fns';
import * as patientRepo from '../repositories/patient.repository';
import * as doctorRepo from '../repositories/doctor.repository';
import * as branchRepo from '../repositories/branch.repository';
import * as slotRepo from '../repositories/doctorSlot.repository';
import * as appointmentRepo from '../repositories/appointment.repository';

import {
  BookAppointmentInput,
  ChangeAppointmentStatusInput,
  ConfirmPaymentInput,
  GetPatientAppointmentsInput,
  GetDoctorAppointmentsInput,
  AdminSearchAppointmentsInput,
  GetAvailableSlotsInput,
  CreateSlotInput,
} from '../types/appointment.types';

import { DoctorSlot } from '../models/doctorSlot.model';
import { processFakePayment } from '../utils/payment.util';

class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const HTTP_STATUS = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
};

export const bookAppointment = async ({
  userId,
  doctorId,
  branchId,
  slotId,
  appointmentReason,
}: BookAppointmentInput) => {
  const patient = await patientRepo.findPatientByUserId(userId);
  if (!patient) {
    throw new AppError('Patient profile not found', HTTP_STATUS.NOT_FOUND);
  }

  const doctor = await doctorRepo.findDoctorById(doctorId);
  if (!doctor) {
    throw new AppError('Doctor not found', HTTP_STATUS.NOT_FOUND);
  }

  const branch = await branchRepo.findBranchById(branchId);
  if (!branch) {
    throw new AppError('Branch not found', HTTP_STATUS.NOT_FOUND);
  }

  const slot = await slotRepo.findSlotById(slotId);
  if (!slot) {
    throw new AppError('Slot not found', HTTP_STATUS.NOT_FOUND);
  }

  if (slot.isBooked) {
    throw new AppError('Slot already booked', HTTP_STATUS.BAD_REQUEST);
  }

  const today = startOfDay(new Date());
  const slotDate = startOfDay(new Date(slot.slotDate));

  if (isBefore(slotDate, today)) {
    throw new AppError(
      'Cannot book appointment in the past',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const appointment = await appointmentRepo.createAppointment({
    patientId: patient.id,
    doctorId,
    branchId,
    slotId,
    appointmentReason,
  });

  await slotRepo.markSlotBooked(slot as DoctorSlot);

  return appointment;
};

export const changeAppointmentStatus = async ({
  appointmentId,
  status,
}: ChangeAppointmentStatusInput) => {
  const appointment = await appointmentRepo.findAppointmentById(appointmentId);

  if (!appointment) {
    throw new AppError('Appointment not found', HTTP_STATUS.NOT_FOUND);
  }

  const validTransitions: Record<string, string[]> = {
    requested: ['cancelled'],
    confirmed: ['completed', 'missed'],
  };

  if (!validTransitions[appointment.status]?.includes(status)) {
    throw new AppError('Invalid status transition', HTTP_STATUS.BAD_REQUEST);
  }

  if (status === 'cancelled') {
    const slot = await slotRepo.findSlotById(appointment.slotId);
    if (slot) {
      await slotRepo.releaseSlot(slot);
    }
  }

  return appointmentRepo.updateAppointmentStatus(appointment, status);
};

export const confirmPayment = async ({
  appointmentId,
  //   card_number,
  //   CVV_number,
}: ConfirmPaymentInput) => {
  const appointment = await appointmentRepo.findAppointmentById(appointmentId);

  if (!appointment) {
    throw new AppError('Appointment not found', HTTP_STATUS.NOT_FOUND);
  }

  //   if (appointment.paymentStatus === 'paid') {
  //     throw new AppError('Already paid', HTTP_STATUS.BAD_REQUEST);
  //   }

  const paymentSuccess = await processFakePayment();

  if (!paymentSuccess) {
    throw new AppError('Payment filed', HTTP_STATUS.BAD_REQUEST);
    // await appointmentRepo.updateAppointmentStatus(appointment, 'confirmed');
  }
  await appointmentRepo.updatePaymentStatus(appointment, 'paid');
  await appointmentRepo.updateAppointmentStatus(appointment, 'confirmed');

  return appointment;
};

export const getPatientAppointments = async ({
  userId,
  page,
  limit,
}: GetPatientAppointmentsInput) => {
  const patient = await patientRepo.findPatientByUserId(userId);
  if (!patient) {
    throw new AppError('Patient not found', HTTP_STATUS.NOT_FOUND);
  }

  return appointmentRepo.findAppointmentsByPatient(patient.id, page, limit);
};

export const getDoctorAppointments = async ({
  doctorId,
  page,
  limit,
}: GetDoctorAppointmentsInput) => {
  return appointmentRepo.findAppointmentsByDoctor(doctorId, page, limit);
};

export const adminSearchAppointments = async (
  input: AdminSearchAppointmentsInput
) => {
  return appointmentRepo.adminSearchAppointments(input);
};

export const getAvailableSlots = async ({
  doctorId,
  date,
}: GetAvailableSlotsInput) => {
  return slotRepo.findAvailableSlots(doctorId, date);
};

export const createSlot = async ({
  doctorId,
  branchId,
  startTime,
  endTime,
}: CreateSlotInput) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start >= end) {
    throw new AppError('Start time must be before end time', 400);
  }
  if (start < new Date()) {
    throw new AppError('Cannot create slot in the past', 400);
  }

  const slotDate = start.toISOString().split('T')[0];

  const overlapping = await slotRepo.findOverlappingSlot(
    doctorId,
    branchId,
    start,
    end
  );

  if (overlapping) {
    throw new AppError('Slot already exists for this time', 400);
  }

  return slotRepo.createSlot(doctorId, branchId, slotDate, start, end);
};
