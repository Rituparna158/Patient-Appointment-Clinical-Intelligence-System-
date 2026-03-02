import { z } from 'zod';
import { AppointmentStatus, PaymentStatus } from '../types/appointment.types';

export const bookAppointmentSchema = z.object({
  doctorId: z.uuid(),
  branchId: z.uuid(),
  slotId: z.uuid(),
  appointmentReason: z.string().max(500).optional(),
});

export const changeStatusSchema = z.object({
  status: z.enum([
    'requested',
    'confirmed',
    'completed',
    'missed',
    'cancelled',
  ] as [AppointmentStatus, ...AppointmentStatus[]]),
});

export const confirmPaymentSchema = z.object({
  appointmentId: z.uuid(),
  //   paymentStatus: z.enum(['pending', 'paid', 'failed'] as [
  //     PaymentStatus,
  //     ...PaymentStatus[],
  //   ]),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
  search: z.string().optional(),
  status: z
    .enum(['requested', 'confirmed', 'completed', 'missed', 'cancelled'])
    .optional(),
  branchId: z.string().optional(),
});

export const createSlotSchema = z.object({
  doctorId: z.uuid(),
  branchId: z.uuid(),
  startTime: z.string(),
  endTime: z.string(),
});

export const createBranchSchema = z.object({
  name: z.string(),
  address: z.string(),
  phone: z.string(),
});
