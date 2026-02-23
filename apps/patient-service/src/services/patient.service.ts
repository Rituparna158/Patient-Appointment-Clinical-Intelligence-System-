import {
  CreatePatientProfileDTO,
  UpdatePatientProfileDTO,
  PatientResponseDTO,
} from '../types/patient.types';
import { Patient } from '../models/pateint.model';
//import { MESSAGES } from '../../../auth-service/src/constants/messages';

const createPateintProfile = async (
  userId: string,
  payload: CreatePatientProfileDTO
): Promise<PatientResponseDTO> => {
  const existing = await Patient.findOne({
    where: { userId },
  });

  if (existing) {
    throw new Error('Patient already exists');
  }

  const patient = await Patient.create({
    userId,
    ...payload,
  });

  return patient.toJSON() as unknown as PatientResponseDTO;
};

const getMyProfile = async (
  userId: string
): Promise<PatientResponseDTO | null> => {
  const patient = await Patient.findOne({
    where: { userId },
  });

  return patient ? (patient.toJSON() as PatientResponseDTO) : null;
};

const updatePatientProfile = async () => {};

export { createPateintProfile, getMyProfile, updatePatientProfile };
