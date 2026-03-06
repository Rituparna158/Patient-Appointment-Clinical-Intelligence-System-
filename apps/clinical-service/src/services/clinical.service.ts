import { Notification } from '../models/external/notification.model';
import * as appointmentRepo from '../repositories/appointment.repository';
import * as doctorRepo from '../repositories/doctor.repository';
import * as consultationRepo from '../repositories/consultation.repository';
import * as patientRepo from '../repositories/patient.repository';
import * as rbacRepo from '../repositories/rbac.repository';
import { AppError } from '../utils/app-error';
import {
  CreateConsultationNoteInput,
  UpdateConsultationNoteInput,
} from '../types/clinical.types';

import { clinicalQueue } from '../queues/clinical.producer';

export const createNote = async (
  doctorUserId: string,
  data: CreateConsultationNoteInput
) => {
  const doctor = await doctorRepo.findDoctorByUserId(doctorUserId);
  if (!doctor) {
    throw new AppError('Doctor not found', 404);
  }

  const appointment = await appointmentRepo.findAppointmentById(
    data.appointmentId
  );

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  if (!['confirmed', 'completed'].includes(appointment.status)) {
    throw new AppError('Cannot add note before appointment is confirmed', 400);
  }

  if (appointment.doctorId !== doctor.id) {
    throw new AppError('Unauthorized doctor access', 403);
  }
  const createNote = await consultationRepo.createConsultationNote({
    appointmentId: data.appointmentId,
    symptoms: data.symptoms,
    diagnosis: data.diagnosis,
    prescriptions: data.prescriptions,
    notes: data.notes,
    followUpDate: data.followUpDate ? new Date(data.followUpDate) : undefined,
    createdBy: doctorUserId,
  });

  await clinicalQueue.add('consultation.followup', {
    consultationId: createNote.id,
  });

  if (data.followUpDate) {
    await Notification.create({
      appointmentId: appointment.id,
      userId: appointment.patientId,
      type: 'follow_up',
      message: `Follow-up scheduled for ${data.followUpDate}`,
      scheduledAt: new Date(data.followUpDate),
    });
  }
  return createNote;
};

export const updateNote = async (
  noteId: string,
  doctorUserId: string,
  data: UpdateConsultationNoteInput
) => {
  const doctor = await doctorRepo.findDoctorByUserId(doctorUserId);
  if (!doctor) throw new AppError('Doctor not found', 404);

  const note = await consultationRepo.findByNoteId(noteId);
  if (!note) throw new AppError('Note not found', 404);

  if (note.lockedAt) {
    throw new AppError(
      "This Consultation note is locked and can't b edited anymore",
      400
    );
  }

  const updatedNote = await consultationRepo.updateConsultationNote(noteId, {
    symptoms: data.symptoms,
    diagnosis: data.diagnosis,
    prescriptions: data.prescriptions,
    notes: data.notes,
    followUpDate: data.followUpDate ? new Date(data.followUpDate) : undefined,
    updatedBy: doctorUserId,
  });
  return updatedNote;
};

export const getDoctorConsultations = async (
  doctorUserId: string,
  search?: string,
  from?: string,
  to?: string,
  page = 1,
  limit = 10
) => {
  const doctor = await doctorRepo.findDoctorByUserId(doctorUserId);
  if (!doctor) throw new AppError('Doctor not found', 404);

  return consultationRepo.findDoctorConsultations(
    doctor.id,
    search,
    from,
    to,
    page,
    limit
  );
};

export const getPatientTimeline = async (
  userId: string,
  page: number,
  limit: number
) => {
  const patient = await patientRepo.findByUserId(userId);
  if (!patient) throw new AppError('Patient not found', 404);
  return consultationRepo.findPatientTimeline(patient.id, page, limit);
};

export const getAllRecords = async (search?: string, page = 1, limit = 10) =>
  consultationRepo.findAllClinicalRecords(search, page, limit);

export const getNotesByAppointment = async (
  appointmentId: string,
  userId: string
) => {
  const appointment = await appointmentRepo.findAppointmentById(appointmentId);

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  const doctor = await doctorRepo.findDoctorByUserId(userId);
  if (doctor) {
    if (appointment.doctorId !== doctor.id) {
      throw new AppError('Unauthorized access', 403);
    }

    return consultationRepo.findByAppointmentId(appointmentId);
  }

  const patient = await patientRepo.findByUserId(userId);
  if (patient) {
    if (appointment.patientId !== patient.id) {
      throw new AppError('Unauthorized access', 403);
    }

    return consultationRepo.findByAppointmentId(appointmentId);
  }

  // Admin check
  const userRole = await rbacRepo.getUserRole(userId);
  const role = userRole ? await rbacRepo.getRole(userRole.roleId) : null;

  if (role?.name === 'admin') {
    return consultationRepo.findByAppointmentId(appointmentId);
  }

  throw new AppError('Unauthorized access', 403);
};
