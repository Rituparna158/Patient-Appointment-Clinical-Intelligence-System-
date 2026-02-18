import { hashPassword } from '../utils/hash';
import { AppError } from '../utils/app-error';
import { HTTP_STATUS } from '../constants/http-status';
import { MESSAGES } from '../constants/messages';
import { User, UserRole, Doctor } from '../models';
import { Role } from '../models';
import { CreateDoctorDTO, CreateAdminDTO } from '../types/admin.types';

const createDoctorUser = async (data: CreateDoctorDTO) => {
  const existing = await User.findOne({
    where: { email: data.email },
  });
  if (existing) {
    throw new AppError(MESSAGES.EMAIL_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
  }
  const hashedPassword = await hashPassword(data.password);

  const user = await User.create({
    email: data.email,
    passwordHash: hashedPassword,
    full_name: data.full_name,
    phone: data.phone ?? null,
  });
  const doctorRole = await Role.findOne({
    where: { name: 'doctor' },
  });
  if (!doctorRole) {
    throw new AppError('Doctor role not found', HTTP_STATUS.INTERNAL_ERROR);
  }
  await UserRole.create({
    userId: user.id,
    roleId: doctorRole.id,
  });
  const doctorProfile = await Doctor.create({
    userId: user.id,
    specialization: data.specialization,
    licence_no: data.licence_no,
    consultation_fee: data.consultation_fee,
    is_active: true,
  });
  return { user, doctorProfile };
};

const createAdminUser = async (data: CreateAdminDTO) => {
  const existing = await User.findOne({
    where: { email: data.email },
  });
  if (existing) {
    throw new AppError(MESSAGES.EMAIL_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
  }
  const hashedPassword = await hashPassword(data.password);

  const user = await User.create({
    email: data.email,
    passwordHash: hashedPassword,
    full_name: data.full_name,
    phone: data.phone ?? null,
    isActive: true,
  });

  const adminRole = await Role.findOne({
    where: { name: 'admin' },
  });
  if (!adminRole) {
    throw new AppError('Admin role not found', HTTP_STATUS.INTERNAL_ERROR);
  }
  await UserRole.create({
    userId: user.id,
    roleId: adminRole.id,
  });

  return user;
};
export { createDoctorUser, createAdminUser };
