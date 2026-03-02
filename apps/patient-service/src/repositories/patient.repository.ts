import { Op, where } from 'sequelize';
import { Patient } from '../models/patient.model';
import { User } from '../models/rbac/user.model';
import {
  CreatePatientDTO,
  UpdatePatientDTO,
  PatientSearchQuery,
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
  const offset = (page - 1) * limit;

  const userWhere = search
    ? {
        [Op.or]: [
          {
            full_name: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            email: {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      }
    : undefined;

  const { rows, count } = await Patient.findAndCountAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'full_name', 'email'],
        where: userWhere,
      },
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return {
    total: count,
    page,
    limit,
    patients: rows,
  };
};
