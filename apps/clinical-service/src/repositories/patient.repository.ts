import { Op, where } from 'sequelize';
import { Patient } from '../models';

export const findByUserId = (userId: string) =>
  Patient.findOne({ where: { userId } });
