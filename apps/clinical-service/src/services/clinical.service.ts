import { Notification } from '../models/external/notification.model';
import * as appointmentRepo from '../repositories/appointment.repository';
import * as doctorRepo from '../repositories/doctor.repository';
import * as consultationRepo from '../repositories/consultation.repository';
import * as patientRepo from '../repositories/patient.repository';
import * as rbacRepo from '../repositories/rbac.repository';
import { AppError } from '../utils/app-error';
import {
  CreateConsultationNoteInput,
  GetAllClinicalRecordsInput,
  GetDoctorConsultationsInput,
  GetPatientTimelineInput,
  UpdateConsultationNoteInput,
  ConsultationWithAppointment,
} from '../types/clinical.types';

import { clinicalQueue } from '../queues/clinical.producer';
import { HTTP_STATUS } from '../constants/http_status';

export const createNote = async (
  doctorUserId: string,
  data: CreateConsultationNoteInput
) => {
  const existingNote = await consultationRepo.findByAppointmentId(
    data.appointmentId
  );
  if (existingNote && existingNote.length > 0) {
    throw new AppError(
      'Consultation note already exists for this appointment',
      HTTP_STATUS.BAD_REQUEST
    );
  }

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

  const patient = await patientRepo.findById(appointment.patientId);

  if (!patient) {
    throw new AppError('Patient not found', 404);
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
  input: GetDoctorConsultationsInput
) => {
  const doctor = await doctorRepo.findDoctorByUserId(input.doctorUserId);

  if (!doctor) {
    throw new AppError('Doctor not found', 404);
  }

  return consultationRepo.findDoctorConsultations(
    doctor.id,
    input.search,
    input.from,
    input.to,
    input.page,
    input.limit,
    input.sortBy,
    input.sortOrder
  );
};

export const getPatientTimeline = async (input: GetPatientTimelineInput) => {
  const patient = await patientRepo.findByUserId(input.userId);

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  return consultationRepo.findPatientTimeline(
    patient.id,
    input.search,
    input.from,
    input.to,
    input.page,
    input.limit,
    input.sortBy,
    input.sortOrder
  );
};

export const getAllRecords = async (input: GetAllClinicalRecordsInput) => {
  return consultationRepo.findAllClinicalRecords(
    input.search,
    input.from,
    input.to,
    input.page,
    input.limit,
    input.sortBy,
    input.sortOrder
  );
};

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

  const userRole = await rbacRepo.getUserRole(userId);
  const role = userRole ? await rbacRepo.getRole(userRole.roleId) : null;

  if (role?.name === 'admin') {
    return consultationRepo.findByAppointmentId(appointmentId);
  }

  throw new AppError('Unauthorized access', 403);
};

export const getPatientProfileForDoctor = async (
  userId: string,
  patientId: string
) => {
  const doctor = await doctorRepo.findDoctorByUserId(userId);

  if (!doctor) {
    throw new AppError('Doctor not found', HTTP_STATUS.NOT_FOUND);
  }

  const consultations: ConsultationWithAppointment[] =
    await consultationRepo.findPatientProfileForDoctor(patientId, doctor.id);

  if (!consultations || consultations.length === 0) {
    throw new AppError(
      'No consultation history found for patient',
      HTTP_STATUS.NOT_FOUND
    );
  }

  const patient = consultations[0].appointment?.patient;

  return {
    patient,

    consultations,
  };
};
