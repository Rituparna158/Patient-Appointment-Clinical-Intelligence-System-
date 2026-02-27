import { Doctor } from '../models/external/doctor.model';

export const findDoctorById = (doctorId: string) =>
  Doctor.findOne({
    where: { id: doctorId, is_active: true },
  });
export const findDoctorByUserId = (userId: string) =>
  Doctor.findOne({
    where: { userId, is_active: true },
  });
