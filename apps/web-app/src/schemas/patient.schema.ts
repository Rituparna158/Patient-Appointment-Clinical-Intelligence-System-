import { z } from 'zod';

export const patientProfileSchema = z.object({
  address: z
    .string()
    .min(3, 'Address must be at least 3 characters')
    .max(255, 'Address too long')
    .optional(),

  emergencyContact: z
    .string()
    .min(5, 'Emergency contact must be at least 5 characters')
    .max(20, 'Emergency contact too long'),
});

export type PatientProfileForm = z.infer<typeof patientProfileSchema>;
