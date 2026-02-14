import { RegisterDTO, User } from '../types/auth.types';
import { hashPassword } from '../utils/hash';
import { MESSAGES } from '../constants/messages';
import { findByEmail, saveUser } from '../repositories/user.repo';
import { comparePassword } from '../utils/compare';
import { generateToken } from '../utils/jwt';
import { ROLES } from '../constants/roles';
import { AppError } from '../utils/app-error';
import { HTTP_STATUS } from '../constants/http-status';

const registerUser = async (data: RegisterDTO): Promise<User> => {
  const existing = await findByEmail(data.email);
  if (existing) {
    throw new AppError(MESSAGES.EMAIL_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
  }
  const hashedPassword = await hashPassword(data.password);
  const newUserRecord = await saveUser({
    email: data.email,
    password: hashedPassword,
    role: ROLES.PATIENT,
  });
  return newUserRecord.toJSON() as User;
};
const loginUser = async (data: RegisterDTO) => {
  const userRecord = await findByEmail(data.email);
  if (!userRecord) {
    throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  const user = userRecord.toJSON() as User;
  const match = await comparePassword(data.password, user.password);
  if (!match) {
    throw new AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  return { token };
};
export { registerUser, loginUser };
