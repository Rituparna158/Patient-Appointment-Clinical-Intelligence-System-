import { Doctor } from '../models/external/doctor.model';

export const findDoctorByUserId = (userId: string) => {
  return Doctor.findOne({
    where: { userId, is_active: true },
  });
};
