import { Doctor } from '../models/external/doctor.model';
import { User } from '../models/external/user.model';

// export const findDoctorById = (doctorId: string) =>
//   Doctor.findOne({
//     where: { id: doctorId, is_active: true },
//   });
export const findDoctorByUserId = (userId: string) =>
  Doctor.findOne({
    where: { userId, is_active: true },
  });

export const findAllActiveDoctors = () =>
  Doctor.findAll({
    where: { is_active: true },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'full_name', 'email'],
      },
    ],
    attributes: ['id', 'specialization'],
    order: [['createdAt', 'DESC']],
  });

export const findDoctorById = (id: string) =>
  Doctor.findByPk(id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'full_name', 'email'],
      },
    ],
  });
