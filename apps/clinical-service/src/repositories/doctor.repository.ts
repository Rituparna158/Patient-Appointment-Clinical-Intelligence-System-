import { Doctor } from '@repo/shared-database';

export const findDoctorByUserId = (userId: string) => {
  return Doctor.findOne({
    where: { userId, is_active: true },
  });
};
