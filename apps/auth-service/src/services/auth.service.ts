import { RegisterDTO, User } from '../types/auth.types';
import { hashPassword } from '../utils/hash';
import { MESSAGES } from '../constants/messages';
import { findByEmail, saveUser } from '../repositories/user.repo';
import { comparePassword } from '../utils/compare';
import { generateToken } from '../utils/jwt';
import { ROLES } from '../constants/roles';

const registerUser = async (data: RegisterDTO): Promise<User> => {
  const existing = await findByEmail(data.email);
  if (existing) {
    throw new Error(MESSAGES.EMAIL_ALREADY_EXISTS);
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
    throw new Error(MESSAGES.USER_NOT_FOUND);
  }
  const user = userRecord.toJSON() as User;
  const match = await comparePassword(data.password, user.password);
  if (!match) {
    throw new Error(MESSAGES.INVALID_CREDENTIALS);
  }
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  return { token };
};
export { registerUser, loginUser };
