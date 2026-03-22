import { User } from '@repo/shared-database';

const findByEmail = async (email: string) => {
  return User.findOne({
    where: { email },
  });
};
const saveUser = async (user: any) => {
  return User.create(user);
};
export { findByEmail, saveUser };
