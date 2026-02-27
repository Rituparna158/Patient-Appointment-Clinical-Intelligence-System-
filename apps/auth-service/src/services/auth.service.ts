import { RegisterDTO, LoginDTO, IUser } from '../types/auth.types';
import { hashPassword } from '../utils/hash';
import { MESSAGES } from '../constants/messages';
import { findByEmail, saveUser } from '../repositories/user.repo';
import { comparePassword } from '../utils/compare';
import {
  verifyRefreshToken,
  generateToken,
  generateRefreshToken,
} from '../utils/jwt';
import { ROLES } from '../constants/roles';
import { AppError } from '../utils/app-error';
import { HTTP_STATUS } from '../constants/http-status';
import { saveRefreshToken } from '../utils/token-store';
import { Role } from '../models/role.model';
import { UserRole } from '../models';
import { getRefreshToken } from '../utils/token-store';
import { User } from '../models/user.model';

const registerUser = async (data: RegisterDTO): Promise<User> => {
  const existing = await findByEmail(data.email);
  if (existing) {
    throw new AppError(MESSAGES.EMAIL_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
  }
  const hashedPassword = await hashPassword(data.password);
  const newUserRecord = await saveUser({
    full_name: data.full_name,
    email: data.email,
    phone: data.phone,
    gender: data.gender,
    date_of_birth: data.date_of_birth,
    passwordHash: hashedPassword,
    isActive: true,
  });
  const patientRole = await Role.findOne({
    where: { name: 'patient' },
  });

  if (!patientRole) {
    throw new AppError('Doctor role not found', HTTP_STATUS.INTERNAL_ERROR);
  }
  await UserRole.create({
    userId: newUserRecord.id,
    roleId: patientRole.id,
  });
  return newUserRecord.toJSON() as User;
};

const loginUser = async (data: LoginDTO) => {
  const userRecord = await User.findOne({
    where: { email: data.email },
    include: [
      {
        model: Role,
        as: 'roles',
        attributes: ['name'],
      },
    ],
  });

  if (!userRecord) {
    throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const user = userRecord.toJSON() as IUser & {
    roles?: { name: string }[];
  };

  const match = await comparePassword(data.password, user.passwordHash);

  if (!match) {
    throw new AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  const roleName =
    user.roles && user.roles.length > 0 ? user.roles[0].name : 'patient';

  const payload = {
    id: user.id,
    email: user.email,
    role: roleName,
  };

  const accessToken = generateToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await saveRefreshToken(user.id, refreshToken);

  return {
    user: {
      id: user.id,
      email: user.email,
      role: roleName,
    },
    accessToken,
    refreshToken,
  };
};

const refreshTokenService = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new AppError('Refresh Token is required', HTTP_STATUS.BAD_REQUEST);
  }
  const decode: any = verifyRefreshToken(refreshToken);

  const stored = await getRefreshToken(decode.id);

  if (!stored || stored !== refreshToken) {
    throw new AppError('Token invalidated', HTTP_STATUS.UNAUTHORIZED);
  }

  const newAccessToken = generateToken({
    id: decode.id,
    email: decode.email,
  });

  return newAccessToken;
};

export { registerUser, loginUser, refreshTokenService };
