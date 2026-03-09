import { z } from 'zod';

export const slotSchema = z
  .object({
    doctorId: z.string().min(1, 'Doctor is required'),
    branchId: z.string().min(1, 'Branch is required'),
    startTime: z.string().min(1, 'Start time required'),
    endTime: z.string().min(1, 'End time required'),
  })
  .refine((data) => new Date(data.startTime) < new Date(data.endTime), {
    message: 'End time must be after start time',
    path: ['endTime'],
  })
  .refine((data) => new Date(data.startTime) >= new Date(), {
    message: 'Cannot create slot in the past',
    path: ['startTime'],
  });

export type SlotForm = z.infer<typeof slotSchema>;
