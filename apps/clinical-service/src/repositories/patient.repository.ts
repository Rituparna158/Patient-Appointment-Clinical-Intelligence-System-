import { Op, where } from 'sequelize';
import { Patient } from '@repo/shared-database';

export const findByUserId = (userId: string) =>
  Patient.findOne({ where: { userId } });

export const findById = (id: string) => Patient.findByPk(id);
