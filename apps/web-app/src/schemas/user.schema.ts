import { z } from 'zod';
import { VALIDATION_MESSAGES } from '@/constants/validation';

export const baseUserSchema = z.object({
  full_name: z
    .string()
    .min(1, VALIDATION_MESSAGES.REQUIRED)
    .min(2, VALIDATION_MESSAGES.NAME_MIN),

  email: z
    .string()
    .min(1, VALIDATION_MESSAGES.REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL),

  phone: z
    .string()
    .min(1, VALIDATION_MESSAGES.REQUIRED)
    .min(6, VALIDATION_MESSAGES.PHONE_MIN),

  // password: z
  //   .string()
  //   .min(1, VALIDATION_MESSAGES.REQUIRED)
  //   .min(6, VALIDATION_MESSAGES.PASSWORD_MIN),
});

export const doctorSchema = baseUserSchema.extend({
  specialization: z
    .string()
    .min(1, VALIDATION_MESSAGES.SPECIALIZATION_REQUIRED),

  licence_no: z.string().min(1, VALIDATION_MESSAGES.LICENCE_REQUIRED),

  consultation_fee: z.number().min(1, VALIDATION_MESSAGES.FEE_MIN),
});
