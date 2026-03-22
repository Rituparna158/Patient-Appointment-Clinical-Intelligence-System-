import { Op, WhereOptions, Order, Includeable } from 'sequelize';

import { ConsultaionNote } from '@repo/shared-database';
import { Appointment } from '@repo/shared-database';
import { Doctor } from '@repo/shared-database';
import { Patient } from '@repo/shared-database';
import { DoctorSlot } from '@repo/shared-database';
import { User } from '@repo/shared-database';

function buildSort(sortBy: string, sortOrder: 'ASC' | 'DESC'): Order {
  if (sortBy === 'doctor') {
    return [
      [
        { model: Appointment, as: 'appointment' },
        { model: Doctor, as: 'doctor' },
        { model: User, as: 'user' },
        'full_name',
        sortOrder,
      ],
    ];
  }

  if (sortBy === 'patient') {
    return [
      [
        { model: Appointment, as: 'appointment' },
        { model: Patient, as: 'patient' },
        { model: User, as: 'user' },
        'full_name',
        sortOrder,
      ],
    ];
  }

  if (sortBy === 'slot' || sortBy === 'slotDate') {
    return [
      [
        { model: Appointment, as: 'appointment' },
        { model: DoctorSlot, as: 'slot' },
        'slotDate',
        sortOrder,
      ],
    ];
  }

  return [['createdAt', sortOrder]];
}

function buildInclude(from?: string, to?: string) {
  const slotWhere: WhereOptions | undefined =
    from || to
      ? {
          slotDate: {
            ...(from ? { [Op.gte]: new Date(from) } : {}),
            ...(to ? { [Op.lte]: new Date(to) } : {}),
          },
        }
      : undefined;

  return [
    {
      model: Appointment,
      as: 'appointment',
      required: true,
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'full_name', 'email'],
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
              attributes: ['id', 'full_name', 'email'],
            },
          ],
        },

        {
          model: DoctorSlot,
          as: 'slot',
          attributes: ['slotDate', 'startTime', 'endTime'],
          required: Boolean(from || to),
          where: slotWhere,
        },
      ],
    },
  ];
}

function buildWhere(search?: string): WhereOptions {
  if (!search) return {};

  return {
    [Op.or]: [
      { symptoms: { [Op.iLike]: `%${search}%` } },

      { diagnosis: { [Op.iLike]: `%${search}%` } },

      { prescriptions: { [Op.iLike]: `%${search}%` } },

      {
        '$appointment.patient.user.full_name$': {
          [Op.iLike]: `%${search}%`,
        },
      },

      {
        '$appointment.doctor.user.full_name$': {
          [Op.iLike]: `%${search}%`,
        },
      },
    ],
  };
}

export const findDoctorConsultations = async (
  doctorId: string,
  search?: string,
  from?: string,
  to?: string,
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  sortOrder: 'ASC' | 'DESC' = 'DESC'
) => {
  // CHANGED: replaced findAndCountAll with count + findAll
  const offset = (page - 1) * limit;
  const where = buildWhere(search);

  const include = [
    {
      model: Appointment,
      as: 'appointment',
      required: true,
      where: {
        doctorId,
      },
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'full_name', 'email'],
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
              attributes: ['id', 'full_name', 'email'],
            },
          ],
        },

        {
          model: DoctorSlot,
          as: 'slot',
          attributes: ['slotDate', 'startTime', 'endTime'],
          required: Boolean(from || to),
          where:
            from || to
              ? {
                  slotDate: {
                    ...(from ? { [Op.gte]: new Date(from) } : {}),
                    ...(to ? { [Op.lte]: new Date(to) } : {}),
                  },
                }
              : undefined,
        },
      ],
    },
  ];

  const count = await ConsultaionNote.count({
    where,
    include,
    distinct: true,
  });

  const rows = await ConsultaionNote.findAll({
    where,
    include,
    limit,
    offset,
    order: buildSort(sortBy, sortOrder),
    subQuery: false,
  });

  return { rows, count };
};

export const findPatientTimeline = async (
  patientId: string,
  search?: string,
  from?: string,
  to?: string,
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  sortOrder: 'ASC' | 'DESC' = 'DESC'
) => {
  // CHANGED: replaced findAndCountAll with count + findAll
  const offset = (page - 1) * limit;
  const where = buildWhere(search);

  const include = [
    {
      model: Appointment,
      as: 'appointment',
      required: true,
      where: {
        patientId,
      },
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'full_name', 'email'],
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
              attributes: ['id', 'full_name', 'email'],
            },
          ],
        },

        {
          model: DoctorSlot,
          as: 'slot',
          attributes: ['slotDate', 'startTime', 'endTime'],
          required: Boolean(from || to),
          where:
            from || to
              ? {
                  slotDate: {
                    ...(from ? { [Op.gte]: new Date(from) } : {}),
                    ...(to ? { [Op.lte]: new Date(to) } : {}),
                  },
                }
              : undefined,
        },
      ],
    },
  ];

  const count = await ConsultaionNote.count({
    where,
    include,
    distinct: true,
  });

  const rows = await ConsultaionNote.findAll({
    where,
    include,
    limit,
    offset,
    order: buildSort(sortBy, sortOrder),
    subQuery: false,
  });

  return { rows, count };
};

export const findAllClinicalRecords = async (
  search?: string,
  from?: string,
  to?: string,
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  sortOrder: 'ASC' | 'DESC' = 'DESC'
) => {
  // CHANGED: replaced findAndCountAll with count + findAll
  const offset = (page - 1) * limit;
  const where = buildWhere(search);
  const include = buildInclude(from, to);

  const count = await ConsultaionNote.count({
    where,
    include,
    distinct: true,
  });

  const rows = await ConsultaionNote.findAll({
    where,
    include,
    limit,
    offset,
    order: buildSort(sortBy, sortOrder),
    subQuery: false,
  });

  return { rows, count };
};
export const findByAppointmentId = (appointmentId: string) =>
  ConsultaionNote.findAll({
    where: { appointmentId },

    include: buildInclude(),
  });

export const createConsultationNote = (data: {
  appointmentId: string;
  symptoms: string;
  diagnosis: string;
  prescriptions: string;
  notes?: string;
  followUpDate?: Date;
  createdBy: string;
}) => {
  return ConsultaionNote.create(data);
};

export const updateConsultationNote = async (
  noteId: string,

  data: {
    symptoms?: string;
    diagnosis?: string;
    prescriptions?: string;
    notes?: string;
    followUpDate?: Date;
    updatedBy: string;
  }
) => {
  const note = await ConsultaionNote.findByPk(noteId);

  if (!note) return null;

  return note.update(data);
};

export const findByNoteId = (noteId: string) => {
  return ConsultaionNote.findByPk(noteId);
};

export const lockNote = async (noteId: string) => {
  return ConsultaionNote.update(
    { lockedAt: new Date() },

    { where: { id: noteId } }
  );
};

export const findPatientProfileForDoctor = async (
  patientId: string,
  doctorId: string
) => {
  return ConsultaionNote.findAll({
    include: [
      {
        model: Appointment,
        as: 'appointment',
        required: true,

        where: {
          patientId,
          doctorId,
        },

        include: [
          {
            model: Patient,
            as: 'patient',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'full_name', 'email'],
              },
            ],
          },

          {
            model: Doctor,
            as: 'doctor',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'full_name', 'email'],
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
    ],

    order: [['createdAt', 'DESC']],
  });
};
