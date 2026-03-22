import { Op, where } from 'sequelize';
import { Doctor, Patient } from '@repo/shared-database';
import { User } from '@repo/shared-database';
import {
  CreatePatientDTO,
  UpdatePatientDTO,
  PatientSearchQuery,
  DoctorSearchQuery,
} from '../validators/patient.validators';

export const findByUserId = (userId: string) =>
  Patient.findOne({ where: { userId } });

export const createPatient = (userId: string, data: CreatePatientDTO) =>
  Patient.create({
    userId,
    address: data.address,
    emergencyContact: data.emergencyContact,
  });

export const updatePatient = (patient: Patient, data: UpdatePatientDTO) =>
  patient.update({
    address: data.address ?? patient.address,
    emergencyContact: data.emergencyContact ?? patient.emergencyContact,
  });

export const softDeletePatient = (patient: Patient) =>
  patient.update({ isActive: false });

export const searchPatients = async ({
  search,
  page,
  limit,
}: PatientSearchQuery) => {
  const safePage = Number(page) > 0 ? Number(page) : 1;
  const safeLimit = Number(limit) > 0 ? Number(limit) : 10;
  const offset = (safePage - 1) * safeLimit;

  const searchText = search?.trim();

  const userWhere = searchText
    ? {
        [Op.or]: [
          {
            full_name: {
              [Op.iLike]: `%${searchText}%`,
            },
          },
          {
            email: {
              [Op.iLike]: `%${searchText}%`,
            },
          },
        ],
      }
    : undefined;

  const include = [
    {
      model: User,
      as: 'user',
      attributes: ['id', 'full_name', 'email'],
      where: userWhere,
      required: Boolean(searchText),
    },
  ];

  const total = await Patient.count({
    include,
    distinct: true,
    col: 'id',
  });

  const patients = await Patient.findAll({
    include,
    limit: safeLimit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return {
    total,
    page: safePage,
    limit: safeLimit,
    patients,
  };
};

export const searchDoctors = async ({
  search,
  page,
  limit,
}: DoctorSearchQuery) => {
  const safePage = Number(page) > 0 ? Number(page) : 1;
  const safeLimit = Number(limit) > 0 ? Number(limit) : 10;
  const offset = (safePage - 1) * safeLimit;

  const searchText = search?.trim();

  const userWhere = searchText
    ? {
        [Op.or]: [
          {
            full_name: {
              [Op.iLike]: `%${searchText}%`,
            },
          },
          {
            email: {
              [Op.iLike]: `%${searchText}%`,
            },
          },
        ],
      }
    : undefined;

  const include = [
    {
      model: User,
      as: 'user',
      attributes: ['id', 'full_name', 'email'],
      where: userWhere,
      required: Boolean(searchText),
    },
  ];

  const total = await Doctor.count({
    include,
    distinct: true,
    col: 'id',
  });

  const doctors = await Doctor.findAll({
    include,
    limit: safeLimit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return {
    total,
    page: safePage,
    limit: safeLimit,
    doctors,
  };
};
