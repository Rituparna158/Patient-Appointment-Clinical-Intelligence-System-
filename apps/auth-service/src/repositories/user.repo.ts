import { User } from '../types/auth.types';
import { ROLES } from '../constants/roles';
import { UserModel } from '../models/user.model';

const findByEmail = async (email: string) => {
  return UserModel.findOne({
    where: { email },
  });
};
const saveUser = async (user: any) => {
  return UserModel.create(user);
};
export { findByEmail, saveUser };
