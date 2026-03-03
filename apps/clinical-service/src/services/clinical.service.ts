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

export const createNote = async (
  doctorId: string,
  data: CreateConsultationNoteInput
) => {
  const doctor = await doctorRepo.findDoctorByUserId(doctorId);
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
  return consultationRepo.createConsultationNote(data);
};

export const updateNote = async (
  noteId: string,
  doctorUserId: string,
  data: any
) => {
  const doctor = await doctorRepo.findDoctorByUserId(doctorUserId);
  if (!doctor) throw new AppError('Doctor not found', 404);

  const note = await consultationRepo.findByNoteId(noteId);
  if (!note) throw new AppError('Note not found', 404);

  await consultationRepo.updateConsultationNote(noteId, data);

  return { message: 'Updated successfully' };
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
  patientId: string,
  page: number,
  limit: number
) => consultationRepo.findPatientTimeline(patientId, page, limit);

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
