import { Doctor } from '../models/external/doctor.model';

export const findDoctorById = (doctorId: string) =>
  Doctor.findOne({
    where: { id: doctorId, is_active: true },
  });
