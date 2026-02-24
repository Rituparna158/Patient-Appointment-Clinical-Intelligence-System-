import { hashPassword } from '../utils/hash';
import { AppError } from '../utils/app-error';
import { HTTP_STATUS } from '../constants/http-status';
import { MESSAGES } from '../constants/messages';
import { User, UserRole, Doctor, Role } from '../models';
import { CreateDoctorDTO, CreateAdminDTO } from '../types/admin.types';
import { generateTempPassword } from '../utils/generate-password';
import { redis } from '../config/redis';
import { trasport } from '../utils/mailer';

/*CREATE Doctor*/
const createDoctorUser = async (data: CreateDoctorDTO) => {
  const existing = await User.findOne({
    where: { email: data.email },
  });

  if (existing) {
    throw new AppError(MESSAGES.EMAIL_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
  }

  const tempPassword = generateTempPassword();
  const hashedPassword = await hashPassword(tempPassword);

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

  // Store plain password in Redis (30 minutes)
  await redis.set(`register:password:${user.id}`, tempPassword, 'EX', 1800);

  await trasport.sendMail({
    from: process.env.MAIL_USER,
    to: user.email,
    subject: 'Your Doctor Account Credentials',
    html: `
      <h3>Hello ${user.full_name}</h3>
      <p>Your doctor account has been created.</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Password:</strong> ${tempPassword}</p>
      <p>Please login using these credentials.</p>
    `,
  });

  return { user, doctorProfile };
};

/* CREATE ADMIN= */

const createAdminUser = async (data: CreateAdminDTO) => {
  const existing = await User.findOne({
    where: { email: data.email },
  });

  if (existing) {
    throw new AppError(MESSAGES.EMAIL_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
  }

  const tempPassword = generateTempPassword();
  const hashedPassword = await hashPassword(tempPassword);

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

  await redis.set(`register:password:${user.id}`, tempPassword, 'EX', 1800);

  await trasport.sendMail({
    from: process.env.MAIL_USER,
    to: user.email,
    subject: 'Your Admin Account Credentials',
    html: `
      <h3>Hello ${user.full_name}</h3>
      <p>Your admin account has been created.</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Password:</strong> ${tempPassword}</p>
      <p>Please login using these credentials.</p>
    `,
  });

  return { user };
};

export { createDoctorUser, createAdminUser };
