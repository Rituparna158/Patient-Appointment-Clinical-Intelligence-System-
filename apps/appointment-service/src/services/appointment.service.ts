import { isBefore, startOfDay } from 'date-fns';
import * as patientRepo from '../repositories/patient.repository';
import * as doctorRepo from '../repositories/doctor.repository';
import * as branchRepo from '../repositories/branch.repository';
import * as slotRepo from '../repositories/doctorSlot.repository';
import * as appointmentRepo from '../repositories/appointment.repository';
import { HTTP_STATUS } from '../constants/http_status';
import { AppError } from '../utils/app-error';

import {
  BookAppointmentInput,
  ChangeAppointmentStatusInput,
  ConfirmPaymentInput,
  GetPatientAppointmentsInput,
  GetDoctorAppointmentsInput,
  AdminSearchAppointmentsInput,
  GetAvailableSlotsInput,
  CreateSlotInput,
  CreateBranchInput,
} from '../types/appointment.types';

import { DoctorSlot } from '../models/doctorSlot.model';
import { processFakePayment } from '../utils/payment.util';

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
}: ConfirmPaymentInput) => {
  const appointment = await appointmentRepo.findAppointmentById(appointmentId);

  if (!appointment) {
    throw new AppError('Appointment not found', HTTP_STATUS.NOT_FOUND);
  }

  const paymentSuccess = await processFakePayment();

  if (!paymentSuccess) {
    throw new AppError('Payment filed', HTTP_STATUS.BAD_REQUEST);
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
  const slotDate = startTime.split('T')[0];
  const start = startTime.split('T')[1];
  const end = endTime.split('T')[1];

  if (start >= end) {
    throw new AppError('Start time must be before end time', 400);
  }
  const now = new Date();

  const today = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 8);

  if (slotDate < today) {
    throw new AppError('Cannot create slot in the past', 400);
  }

  if (slotDate === today && start <= currentTime) {
    throw new AppError('Cannot create slot in the past', 400);
  }

  const overlapping = await slotRepo.findOverlappingSlot(
    doctorId,
    branchId,
    slotDate,
    start,
    end
  );

  if (overlapping) {
    throw new AppError('Slot already exists for this time', 400);
  }

  return slotRepo.createSlot(doctorId, branchId, slotDate, start, end);
};

export const getDoctorAppointmentsByUser = async ({
  userId,
  page,
  limit,
}: {
  userId: string;
  page: number;
  limit: number;
}) => {
  const doctor = await doctorRepo.findDoctorByUserId(userId);

  if (!doctor) {
    throw new AppError('Doctor not found', 404);
  }

  return appointmentRepo.findAppointmentsByDoctor(doctor.id, page, limit);
};

export const createBranch = async (data: CreateBranchInput) => {
  if (!data.name || !data.address || !data.phone) {
    throw new AppError(
      'Name, address and phone are required',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const existing = await branchRepo.findBranchByName(data.name);

  if (existing) {
    throw new AppError(
      'Branch with this name already exists',
      HTTP_STATUS.CONFLICT
    );
  }

  return branchRepo.createBranch(data);
};

export const getAllDoctors = async () => {
  return doctorRepo.findAllActiveDoctors();
};

export const getAllBranches = async () => {
  return branchRepo.findAllActiveBranches();
};

export const cancelAppointmentWithRefund = async (appointmentId: string) => {
  const appointment = await appointmentRepo.findAppointmentById(appointmentId);

  if (!appointment) {
    throw new AppError('Appointment not found', HTTP_STATUS.NOT_FOUND);
  }

  if (appointment.status === 'completed') {
    throw new AppError(
      'Completed appointment cannot be cancelled',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  if (appointment.paymentStatus === 'paid') {
    await appointmentRepo.updatePaymentStatus(appointment, 'refunded');
  }

  const slot = await slotRepo.findSlotById(appointment.slotId);

  if (slot) {
    await slotRepo.releaseSlot(slot);
  }

  await appointmentRepo.updateAppointmentStatus(appointment, 'cancelled');

  return appointment;
};

export const rescheduleAppointment = async (
  appointmentId: string,
  newSlotId: string
) => {
  const appointment = await appointmentRepo.findAppointmentById(appointmentId);

  if (!appointment) {
    throw new AppError('Appointment not found', HTTP_STATUS.NOT_FOUND);
  }

  if (appointment.status === 'completed') {
    throw new AppError(
      'Completed appointment cannot be rescheduled',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const newSlot = await slotRepo.findSlotById(newSlotId);

  if (!newSlot) {
    throw new AppError('Slot not found', HTTP_STATUS.NOT_FOUND);
  }

  if (newSlot.isBooked) {
    throw new AppError('Slot already booked', HTTP_STATUS.BAD_REQUEST);
  }

  const oldSlot = await slotRepo.findSlotById(appointment.slotId);

  if (oldSlot) {
    await slotRepo.releaseSlot(oldSlot);
  }

  await slotRepo.markSlotBooked(newSlot);

  await appointmentRepo.updateAppointmentSlot(
    appointment,
    newSlotId,
    'rescheduled'
  );

  return appointment;
};
