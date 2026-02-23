import { z } from 'zod';
import { VALIDATION_MESSAGES } from '@/constants/validation';

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty(VALIDATION_MESSAGES.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL),

  password: z
    .string()
    .nonempty(VALIDATION_MESSAGES.REQUIRED)
    .min(6, VALIDATION_MESSAGES.PASSWORD_MIN),
});

export const registerSchema = z.object({
  full_name: z
    .string()
    .nonempty(VALIDATION_MESSAGES.REQUIRED)
    .min(2, VALIDATION_MESSAGES.NAME_MIN),

  email: z
    .string()
    .nonempty(VALIDATION_MESSAGES.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL),

  phone: z
    .string()
    .nonempty(VALIDATION_MESSAGES.REQUIRED)
    .min(6, VALIDATION_MESSAGES.PHONE_MIN),

  password: z
    .string()
    .nonempty(VALIDATION_MESSAGES.REQUIRED)
    .min(6, VALIDATION_MESSAGES.PASSWORD_MIN),

  gender: z.string().nonempty(VALIDATION_MESSAGES.REQUIRED),

  date_of_birth: z.string().nonempty(VALIDATION_MESSAGES.REQUIRED),
});
