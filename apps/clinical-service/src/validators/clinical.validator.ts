import { z } from 'zod';
import { CreateConsultationNoteInput } from '../types/clinical.types';

export const createConsultationNoteSchema = z.object({
  appointmentId: z.uuid(),
  symptoms: z.string().min(3).max(100),
  diagnosis: z.string().min(3).max(500),
  prescriptions: z.string().min(10).max(1000),
  notes: z.string().min(20).max(1000).optional(),
});
