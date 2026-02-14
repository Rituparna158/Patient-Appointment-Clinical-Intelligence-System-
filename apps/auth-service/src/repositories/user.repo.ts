import { User } from '../types/auth.types';

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
export { findByEmail, saveUser, clearUsers };
