import { Op, where } from 'sequelize';
import { Patient } from '../models/patient.model';
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

  const whereCondition = search
    ? {
        address: {
          [Op.iLike]: `%${search}%`,
        },
      }
    : {};

  console.log('WhereCondition:', whereCondition);

  const { rows, count } = await Patient.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
  });
  console.log('rowslength:', rows.length);
  console.log('PAGE', page);
  console.log('LIMIT:', limit);
  console.log('OFFSET:', offset);
  return {
    total: count,
    page,
    limit,
    patients: rows,
  };
};
