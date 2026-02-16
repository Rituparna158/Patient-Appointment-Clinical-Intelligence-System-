import { z } from 'zod';

const registerSchema = z.object({
  full_name: z.string().min(3, 'Full name is required'),
  email: z.string().min(1, 'Email is required'),
  phone: z.string().min(10, 'Phone number is required'),
  gender: z.enum(['male', 'female', 'other']),
  date_of_birth: z.date(),
  password: z.string().min(6, 'Password must be aatleast 6 characters'),
});
const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
export { registerSchema, loginSchema };
