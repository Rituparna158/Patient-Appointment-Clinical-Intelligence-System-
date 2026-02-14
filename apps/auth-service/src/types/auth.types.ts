interface RegisterDTO {
  email: string;
  password: string;
}
interface User {
  id: string;
  email: string;
  password: string;
}
export type { RegisterDTO, User };
