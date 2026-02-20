import { ROLES } from '../constants/roles';
interface RegisterDTO {
  full_name: string;
  email: string;
  phone?: string;
  gender?: string;
  date_of_birth?: Date;
  password: string;
}
interface LoginDTO {
  email: string;
  password: string;
}

type Role = (typeof ROLES)[keyof typeof ROLES];
interface IUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  gender?: string;
  date_of_birth?: Date;
  passwordHash: string;
  isActive: boolean;
}
export type { RegisterDTO, LoginDTO, IUser, Role };
