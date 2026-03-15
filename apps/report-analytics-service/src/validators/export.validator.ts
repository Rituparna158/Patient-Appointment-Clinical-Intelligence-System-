import { z } from 'zod';

export const exportQuerySchema = z.object({
  range: z.enum(['today', 'week', 'month', 'year']),
  from: z.string().optional(),
  to: z.string().optional(),
  delivery: z.enum(['download', 'email']),
});
