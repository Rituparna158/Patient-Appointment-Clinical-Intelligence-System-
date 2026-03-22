import { isBefore, startOfDay } from 'date-fns';
import { sequelize } from '../config/database';
import { Transaction } from 'sequelize';
import * as patientRepo from '../repositories/patient.repository';
import * as doctorRepo from '../repositories/doctor.repository';
import * as branchRepo from '../repositories/branch.repository';
import * as slotRepo from '../repositories/doctorSlot.repository';
import * as appointmentRepo from '../repositories/appointment.repository';
import { HTTP_STATUS } from '@repo/shared-constants';
import { AppError } from '@repo/shared-error';
import { logger } from '@repo/shared-utils';
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
  GetDoctorAppointmentsByUserInput,
} from '../types/appointment.types';
import { Appointment } from '@repo/shared-database';
import { processFakePayment } from '../utils/payment.util';
import { appointmentQueue } from '../queues/appointment.producer';

const validateFutureSlotDate = (slotDateValue: Date | string): void => {
  const today = startOfDay(new Date());
  const slotDate = startOfDay(new Date(slotDateValue));

  if (isBefore(slotDate, today)) {
    throw new AppError(
      'Cannot book appointment in the past',
      HTTP_STATUS.BAD_REQUEST
    );
  }
};

const validateSlotTimeForCreation = (
  slotDate: string,
  start: string,
  end: string
): void => {
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
};

const validatePaymentTransition = (
  currentStatus: string,
  nextStatus: string
): void => {
  const validTransitions: Record<string, string[]> = {
    pending: ['paid', 'failed'],
    paid: ['refunded'],
    failed: [],
    refunded: [],
  };

  const allowed = validTransitions[currentStatus] ?? [];

  if (!allowed.includes(nextStatus)) {
    throw new AppError(
      `Invalid payment status transition: ${currentStatus} -> ${nextStatus}`,
      HTTP_STATUS.BAD_REQUEST
    );
  }
};

const releaseAppointmentSlotIfExists = async (
  appointment: Appointment,
  transaction: Transaction
): Promise<void> => {
  if (!appointment.slotId) return;

  const slot = await slotRepo.findSlotById(appointment.slotId, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });

  if (slot) {
    await slotRepo.releaseSlot(slot, { transaction });
  }
};

export const bookAppointment = async ({
  userId,
  doctorId,
  branchId,
  slotId,
  appointmentReason,
}: BookAppointmentInput) => {
  return sequelize.transaction(async (transaction) => {
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

    const slot = await slotRepo.findValidSlotForBooking(
      slotId,
      doctorId,
      branchId,
      {
        transaction,
        lock: transaction.LOCK.UPDATE,
      }
    );

    logger.info({
      msg: 'BOOK_APPOINTMENT_SLOT_DEBUG',
      doctorId,
      branchId,
      slotId,
      slotFound: !!slot,
      slotDoctorId: slot?.doctorId,
      slotBranchId: slot?.branchId,
      slotIsBooked: slot?.isBooked,
    });

    if (!slot) {
      throw new AppError(
        'Invalid slot for selected doctor or branch',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (slot.isBooked) {
      throw new AppError('Slot already booked', HTTP_STATUS.BAD_REQUEST);
    }

    validateFutureSlotDate(slot.slotDate);

    const appointment = await appointmentRepo.createAppointment(
      {
        patientId: patient.id,
        doctorId,
        branchId,
        slotId,
        appointmentReason,
      },
      { transaction }
    );

    if (!appointment) {
      throw new AppError(
        'Failed to create appointment',
        HTTP_STATUS.INTERNAL_ERROR
      );
    }

    await slotRepo.markSlotBooked(slot, { transaction });

    return appointment;
  });
};

export const changeAppointmentStatus = async ({
  appointmentId,
  status,
}: ChangeAppointmentStatusInput) => {
  return sequelize.transaction(async (transaction) => {
    const appointment = await appointmentRepo.findAppointmentByIdForUpdate(
      appointmentId,
      {
        transaction,
        lock: transaction.LOCK.UPDATE,
      }
    );

    if (!appointment) {
      throw new AppError('Appointment not found', HTTP_STATUS.NOT_FOUND);
    }

    const validTransitions: Record<string, string[]> = {
      requested: ['cancelled', 'confirmed'],
      confirmed: ['completed', 'missed', 'cancelled'],
      rescheduled: ['confirmed', 'cancelled'],
      completed: [],
      missed: [],
      cancelled: [],
    };

    const allowedStatuses = validTransitions[appointment.status] ?? [];

    if (!allowedStatuses.includes(status)) {
      throw new AppError('Invalid status transition', HTTP_STATUS.BAD_REQUEST);
    }

    if (status === 'cancelled') {
      await releaseAppointmentSlotIfExists(appointment, transaction);
    }

    await appointmentRepo.updateAppointmentStatus(appointment, status, {
      transaction,
    });

    const hydrated = await appointmentRepo.findAppointmentById(appointment.id, {
      transaction,
    });

    if (!hydrated) {
      throw new AppError(
        'Appointment not found after update',
        HTTP_STATUS.NOT_FOUND
      );
    }

    return hydrated;
  });
};

export const confirmPayment = async ({
  appointmentId,
}: ConfirmPaymentInput) => {
  const appointment = await appointmentRepo.findAppointmentById(appointmentId);

  if (!appointment) {
    throw new AppError('Appointment not found', HTTP_STATUS.NOT_FOUND);
  }

  if (
    appointment.paymentStatus === 'paid' &&
    appointment.status === 'confirmed'
  ) {
    return appointment;
  }

  await appointment.update({
    paymentStatus: 'paid',
    status: 'confirmed',
  });

  const hydratedAppointment = await appointmentRepo.findAppointmentById(
    appointment.id
  );

  if (!hydratedAppointment) {
    throw new AppError('Appointment not found', HTTP_STATUS.NOT_FOUND);
  }

  return hydratedAppointment;
};

export const getPatientAppointments = async (
  input: GetPatientAppointmentsInput
) => {
  const patient = await patientRepo.findPatientByUserId(input.userId);

  if (!patient) {
    throw new AppError('Patient not found', HTTP_STATUS.NOT_FOUND);
  }

  return appointmentRepo.findAppointmentsByPatient(
    patient.id,
    input.page,
    input.limit,
    input.search,
    input.status,
    input.fromDate,
    input.toDate,
    input.sortBy,
    input.sortOrder
  );
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
  branchId,
  date,
}: GetAvailableSlotsInput) => {
  return slotRepo.findAvailableSlots(doctorId, branchId, date);
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

  if (!slotDate || !start || !end) {
    throw new AppError('Invalid startTime or endTime format', 400);
  }

  validateSlotTimeForCreation(slotDate, start, end);

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

export const getDoctorAppointmentsByUser = async (
  input: GetDoctorAppointmentsByUserInput
) => {
  const doctor = await doctorRepo.findDoctorByUserId(input.userId);

  if (!doctor) {
    throw new AppError('Doctor not found', HTTP_STATUS.NOT_FOUND);
  }

  return appointmentRepo.findAppointmentsByDoctor(
    doctor.id,
    input.page,
    input.limit,
    input.search,
    input.status,
    input.fromDate,
    input.toDate,
    input.sortBy,
    input.sortOrder
  );
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
  return sequelize.transaction(async (transaction) => {
    const appointment = await appointmentRepo.findAppointmentByIdForUpdate(
      appointmentId,
      {
        transaction,
        lock: transaction.LOCK.UPDATE,
      }
    );

    if (!appointment) {
      throw new AppError('Appointment not found', HTTP_STATUS.NOT_FOUND);
    }

    if (appointment.status === 'completed') {
      throw new AppError(
        'Completed appointment cannot be cancelled',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (appointment.status === 'cancelled') {
      const hydrated = await appointmentRepo.findAppointmentById(
        appointment.id,
        {
          transaction,
        }
      );
      return hydrated ?? appointment;
    }

    if (appointment.paymentStatus === 'paid') {
      validatePaymentTransition('paid', 'refunded');
      await appointmentRepo.updatePaymentStatus(appointment, 'refunded', {
        transaction,
      });
    }

    await releaseAppointmentSlotIfExists(appointment, transaction);

    await appointmentRepo.updateAppointmentStatus(appointment, 'cancelled', {
      transaction,
    });

    const hydrated = await appointmentRepo.findAppointmentById(appointment.id, {
      transaction,
    });

    if (!hydrated) {
      throw new AppError(
        'Appointment not found after cancellation',
        HTTP_STATUS.NOT_FOUND
      );
    }

    return hydrated;
  });
};

export const rescheduleAppointment = async (
  appointmentId: string,
  newSlotId: string
) => {
  return sequelize.transaction(async (transaction) => {
    const appointment = await appointmentRepo.findAppointmentByIdForUpdate(
      appointmentId,
      {
        transaction,
        lock: transaction.LOCK.UPDATE,
      }
    );

    if (!appointment) {
      throw new AppError('Appointment not found', HTTP_STATUS.NOT_FOUND);
    }

    if (appointment.status === 'completed') {
      throw new AppError(
        'Completed appointment cannot be rescheduled',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (appointment.status === 'cancelled') {
      throw new AppError(
        'Cancelled appointment cannot be rescheduled',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (appointment.slotId === newSlotId) {
      const hydrated = await appointmentRepo.findAppointmentById(
        appointment.id,
        {
          transaction,
        }
      );
      return hydrated ?? appointment;
    }

    const lockedSlots = await slotRepo.findSlotsByIdsForUpdate(
      [appointment.slotId, newSlotId].filter(Boolean) as string[],
      transaction
    );

    const oldSlot = lockedSlots.find((s) => s.id === appointment.slotId);
    const newSlot = lockedSlots.find((s) => s.id === newSlotId);

    if (!newSlot) {
      throw new AppError('Slot not found', HTTP_STATUS.NOT_FOUND);
    }

    if (newSlot.isBooked) {
      throw new AppError('Slot already booked', HTTP_STATUS.BAD_REQUEST);
    }

    validateFutureSlotDate(newSlot.slotDate);

    if (
      newSlot.doctorId !== appointment.doctorId ||
      newSlot.branchId !== appointment.branchId
    ) {
      throw new AppError(
        'Invalid slot for selected doctor or branch',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (oldSlot) {
      await slotRepo.releaseSlot(oldSlot, { transaction });
    }

    await slotRepo.markSlotBooked(newSlot, { transaction });

    await appointmentRepo.updateAppointmentSlot(
      appointment,
      newSlotId,
      'rescheduled',
      { transaction }
    );

    const hydrated = await appointmentRepo.findAppointmentById(appointment.id, {
      transaction,
    });

    if (!hydrated) {
      throw new AppError(
        'Appointment not found after reschedule',
        HTTP_STATUS.NOT_FOUND
      );
    }

    return hydrated;
  });
};
