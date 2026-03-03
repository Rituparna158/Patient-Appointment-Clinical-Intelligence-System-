import * as appointmentRepo from '../repositories/appointment.repository';
import * as doctorRepo from '../repositories/doctor.repository';
import * as consultationRepo from '../repositories/consultation.repository';
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

// export const updateNote = async (
//     noteId: string,
//     doctorUserId: string,
//     data: UpdateConsultationNoteInput
// ) => {

//     const doctor = await

// }

export const getNoteByAppointment = async (appointmentId: string) => {
  const appointment = await appointmentRepo.findAppointmentById(appointmentId);

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  return consultationRepo.findByAppointmentId(appointmentId);
};
