import { Op } from 'sequelize';
import { ConsultaionNote } from '../models/consultationNote.model';
import { Appointment } from '../models/external/appointment.model';
import { Doctor } from '../models/external/doctor.model';
import { DoctorSlot } from '../models/external/doctorSlot.model';
import { Patient } from '../models/external/patient.model';
import { User } from '../models/external/user.model';

import {
  CreateConsultationNoteInput,
  UpdateConsultationNoteInput,
} from '../types/clinical.types';

export const createConsultationNote = (data: CreateConsultationNoteInput) => {
  return ConsultaionNote.create(data);
};

export const findByNoteId = (noteId: string) => {
  return ConsultaionNote.findByPk(noteId);
};

export const updateConsultationNote = async (
  noteId: string,
  data: UpdateConsultationNoteInput
) => {
  const note = await ConsultaionNote.findByPk(noteId);

  if (!note) {
    return null;
  }

  return note.update(data);
};

export const findByAppointmentId = (appointmentId: string) =>
  ConsultaionNote.findAll({
    where: { appointmentId },
    include: buildFullInclude(),
  });

export const findDoctorConsultations = async (
  doctorId: string,

  search?: string,

  from?: string,

  to?: string,

  page = 1,

  limit = 10
) => {
  const offset = (page - 1) * limit;

  const where: any = {};

  if (from && to) {
    const start = new Date(from);

    const end = new Date(to);

    end.setHours(23, 59, 59, 999);

    where.createdAt = {
      [Op.between]: [start, end],
    };
  }

  return ConsultaionNote.findAndCountAll({
    where,

    include: buildFullInclude(doctorId, search),

    offset,

    limit,

    order: [['createdAt', 'DESC']],
  });
};

export const findPatientTimeline = async (
  patientId: string,

  page = 1,

  limit = 10
) => {
  const offset = (page - 1) * limit;

  return ConsultaionNote.findAndCountAll({
    include: buildFullInclude(undefined, undefined, patientId),

    offset,

    limit,

    order: [['createdAt', 'DESC']],
  });
};

export const findAllClinicalRecords = async (
  search?: string,
  page = 1,
  limit = 10
) => {
  const offset = (page - 1) * limit;

  const { rows, count } = await ConsultaionNote.findAndCountAll({
    include: buildFullInclude(undefined, search),
    offset,
    limit,
    order: [['createdAt', 'DESC']],
  });

  return { rows, count };
};

function buildFullInclude(
  doctorId?: string,

  search?: string,

  patientId?: string
) {
  return [
    {
      model: Appointment,

      as: 'appointment',

      required: true,

      where: {
        ...(doctorId ? { doctorId } : {}),

        ...(patientId ? { patientId } : {}),
      },

      include: [
        {
          model: Doctor,

          as: 'doctor',

          include: [
            {
              model: User,

              as: 'user',

              attributes: ['full_name', 'email'],
            },
          ],
        },

        {
          model: Patient,

          as: 'patient',

          include: [
            {
              model: User,

              as: 'user',

              attributes: ['full_name', 'email'],

              where: search
                ? {
                    full_name: {
                      [Op.iLike]: `%${search}%`,
                    },
                  }
                : undefined,
            },
          ],
        },

        {
          model: DoctorSlot,

          as: 'slot',

          attributes: ['slotDate', 'startTime', 'endTime'],
        },
      ],
    },
  ];
}
