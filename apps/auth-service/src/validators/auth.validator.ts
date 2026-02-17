import { z } from 'zod';

const registerSchema = z.object({
  full_name: z
    .string()
    .min(3, 'Full name must be atleast 3 characters')
    .max(50, 'Full name must not exceed 50 characters')
    .regex(/^[A-Za-z\s]+$/, 'Full name must contain only letters and spaces'),
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email must be a Gmail address'),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  date_of_birth: z.coerce
    .date()
    .optional()
    .refine((date) => {
      if (!date) return true;
      return date < new Date();
    }, 'Date of birth must be a past date'),
  password: z
    .string()
    .min(6, 'Password must be aatleast 6 characters')
    .max(20, 'Password must not exceed 20 characters')
    .regex(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])/,
      'Password must contain atleat  upper case letter, 1 number and  symbol'
    ),
});
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email must be a Gmail address'),
  password: z.string().min(6, 'Password must be atleast 6 character'),
});
export { registerSchema, loginSchema };
