import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(6),
});
const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
export { registerSchema, loginSchema };
