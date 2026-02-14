import { User } from '../types/auth.types';
import { ROLES } from '../constants/roles';

const users: User[] = [];

const findByEmail = async (email: string) => {
  return users.find((u) => u.email === email);
};
const saveUser = async (user: User) => {
  users.push(user);
  return user;
};
const clearUsers = () => {
  users.length = 0;
};
const makeUserDoctor = (email: string) => {
  const user = users.find((u) => u.email === email);
  if (user) {
    user.role = ROLES.DOCTOR;
  }
};
export { findByEmail, saveUser, clearUsers, makeUserDoctor };
