import * as repo from '../repositories/patient.repository';
import { AppError } from '../utils/app-error';
import { HTTP_STATUS } from '../constants/http_status';
import { MESSAGES } from '../constants/messages';
import {
  CreatePatientDTO,
  UpdatePatientDTO,
  PatientSearchQuery,
} from '../validators/patient.validators';

const createProfile = async (userId: string, data: CreatePatientDTO) => {
  const existing = await repo.findByUserId(userId);

  if (existing) {
    throw new AppError(MESSAGES.PROFILE_EXISTS, HTTP_STATUS.CONFLICT);
  }

  return repo.createPatient(userId, data);
};

const getProfile = async (userId: string) => {
  const patient = await repo.findByUserId(userId);

  if (!patient) {
    throw new AppError(MESSAGES.PROFILE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return patient;
};

const updateProfile = async (userId: string, data: UpdatePatientDTO) => {
  const patient = await repo.findByUserId(userId);

  if (!patient) {
    throw new AppError(MESSAGES.PROFILE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return repo.updatePatient(patient, data);
};

const deleteProfile = async (userId: string) => {
  const patient = await repo.findByUserId(userId);

  if (!patient) {
    throw new AppError(MESSAGES.PROFILE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return repo.softDeletePatient(patient);
};

const adminSearchPatients = async (query: PatientSearchQuery) => {
  return repo.searchPatients(query);
};

export {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  adminSearchPatients,
};
