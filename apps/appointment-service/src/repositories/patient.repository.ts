import { Patient } from '@repo/shared-database';

export const findPatientByUserId = (userId: string) =>
  Patient.findOne({
    where: { userId, isActive: true },
  });

export const findPatientById = (id: string) =>
  Patient.findOne({
    where: { id, isActive: true },
  });
