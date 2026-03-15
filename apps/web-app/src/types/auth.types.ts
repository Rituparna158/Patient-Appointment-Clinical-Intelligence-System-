type Role = 'patient' | 'doctor' | 'admin';

interface User {
  //role: string;

  id: string;
  email: string;
  roles: Role[];
}

export type { Role, User };
