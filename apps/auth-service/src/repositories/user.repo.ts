import { ROLES } from '../constants/roles';
import { User } from '../models/user.model';

const findByEmail = async (email: string) => {
  return User.findOne({
    where: { email },
  });
};
const saveUser = async (user: any) => {
  return User.create(user);
};
export { findByEmail, saveUser };
