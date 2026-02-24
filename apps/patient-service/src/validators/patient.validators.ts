import { z } from 'zod';

export const createPatientSchema = z.object({
  address: z.string().min(3).max(255).optional(),
  emergencyContact: z.string().min(5).max(20).optional(),
});

export const updatePatientSchema = z.object({
  address: z.string().min(3).max(255).optional(),
  emergencyContact: z.string().min(5).max(20).optional(),
});

export const searchPatientSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1),
  limit: z.coerce.number().min(1),
});

export type CreatePatientDTO = z.infer<typeof createPatientSchema>;
export type UpdatePatientDTO = z.infer<typeof updatePatientSchema>;
export type PatientSearchQuery = z.infer<typeof searchPatientSchema>;
