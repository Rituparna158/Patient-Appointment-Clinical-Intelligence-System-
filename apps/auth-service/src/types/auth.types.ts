import { ROLES } from '../constants/roles';
interface RegisterDTO {
  email: string;
  password: string;
}

type Role = (typeof ROLES)[keyof typeof ROLES];
interface User {
  id: string;
  email: string;
  password: string;
  role: Role;
}
export type { RegisterDTO, User, Role };
