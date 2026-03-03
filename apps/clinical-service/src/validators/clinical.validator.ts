import { z } from 'zod';
import { CreateConsultationNoteInput } from '../types/clinical.types';

export const createConsultationNoteSchema = z.object({
  appointmentId: z.uuid(),
  symptoms: z.string().min(3).max(100),
  diagnosis: z.string().min(3).max(500),
  prescriptions: z.string().min(10).max(1000),
  notes: z.string().min(20).max(1000).optional(),
});

export const updateConsultationNoteSchema = z.object({
  symptoms: z.string().min(3).max(200).optional(),
  diagnosis: z.string().min(3).max(500).optional(),
  prescription: z.string().min(5).max(1000).optional(),
  notes: z.string().min(10).max(1000).optional(),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  search: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});
