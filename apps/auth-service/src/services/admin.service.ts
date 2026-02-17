import { hashPassword } from '../utils/hash';
import { AppError } from '../utils/app-error';
import { HTTP_STATUS } from '../constants/http-status';
import { MESSAGES } from '../constants/messages';
import { User, UserRole } from '../models';
import { Role } from '../models';
import { CreateDoctorDTO } from '../types/admin.types';

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
    isActive: true,
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
  return user;
};
export { createDoctorUser };
