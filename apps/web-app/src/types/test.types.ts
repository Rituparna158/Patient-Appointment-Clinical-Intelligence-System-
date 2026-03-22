export interface AuthResponse {
  user: {
    id?: string;
    roles: string[];
  };
  token: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  date_of_birth: string;
}
