import { z } from 'zod';

export const analyticsTableQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
  from: z.string().optional(),
  to: z.string().optional(),
  sortBy: z.enum(['date', 'totalAppointments']).optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
});

export const trendQuerySchema = z.object({
  range: z.enum(['today', 'week', 'month', 'year']).optional(),
});

export const doctorTableQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),

  from: z.string().optional(),
  to: z.string().optional(),

  sortBy: z.enum(['slotDate', 'status']).optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
});

export const patientTableQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),

  from: z.string().optional(),
  to: z.string().optional(),

  sortBy: z.enum(['slotDate', 'status']).optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
});
