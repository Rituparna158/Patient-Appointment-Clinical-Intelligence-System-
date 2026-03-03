import { ConsultaionNote } from '../models/consultationNote.model';
import { Appointment } from '../models/external/appointment.model';
import { Doctor } from '../models/external/doctor.model';
import {
  CreateConsultationNoteInput,
  UpdateConsultationNoteInput,
} from '../types/clinical.types';
import { User } from '../models/external/user.model';
import { where } from 'sequelize';

export const createConsultationNote = (data: CreateConsultationNoteInput) => {
  return ConsultaionNote.create(data);
};

export const updateConsultationNote = (
  noteId: string,
  data: UpdateConsultationNoteInput
) => {
  ConsultaionNote.update(data, { where: { id: noteId } });
};

export const findByAppointmentId = (appointmentId: string) => {
  return ConsultaionNote.findAll({
    where: { appointmentId },
    include: [
      {
        model: Appointment,
      },
    ],
    //order: [['createdAt', 'DESC']]
  });
};

export const findDoctorConsultation = (doctorId: string) => {
  return ConsultaionNote.findAll({
    include: [
      {
        model: Appointment,
        where: { doctorId },
        include: [
          {
            model: Doctor,
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['full_name'],
              },
            ],
          },
        ],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
};

export const findPatientTimeline = (patientId: string) => {
  return ConsultaionNote.findAll({
    include: [
      {
        model: Appointment,
        where: { patientId },
      },
    ],
    order: [['createdAt', 'DESC']],
  });
};
