import { z } from 'zod';

const createDoctorSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email must be a Gmail address'),

  password: z
    .string()
    .min(6, 'Password must be aatleast 6 characters')
    .max(20, 'Password must not exceed 20 characters')
    .regex(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])/,
      'Password must contain atleat  upper case letter, 1 number and  symbol'
    ),

  full_name: z
    .string()
    .min(3, 'Full name must be atleast 3 characters')
    .max(50, 'Full name must not exceed 50 characters')
    .regex(/^[A-Za-z\s]+$/, 'Full name must contain only letters and spaces'),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .optional(),
  specialization: z.string().min(2, 'Specialization is requiresd'),

  licence_no: z.string().min(3, 'Licence number is required'),

  consultation_fee: z.coerce.number().min(1, 'Consultation fee is required'),

  is_active: z.coerce.boolean().optional(),
});

const createAdminSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email must be a Gmail address'),

  password: z
    .string()
    .min(6, 'Password must be aatleast 6 characters')
    .max(20, 'Password must not exceed 20 characters')
    .regex(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])/,
      'Password must contain atleat  upper case letter, 1 number and  symbol'
    ),

  full_name: z
    .string()
    .min(3, 'Full name must be atleast 3 characters')
    .max(50, 'Full name must not exceed 50 characters')
    .regex(/^[A-Za-z\s]+$/, 'Full name must contain only letters and spaces'),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .optional(),
});

export { createDoctorSchema, createAdminSchema };
