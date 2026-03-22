import { z } from 'zod';
import { AppointmentStatus } from '../types/appointment.types';

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
    'rescheduled',
  ] as [AppointmentStatus, ...AppointmentStatus[]]),
});

export const confirmPaymentSchema = z.object({
  appointmentId: z.uuid(),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  search: z.string().optional(),
  status: z
    .enum([
      'requested',
      'confirmed',
      'completed',
      'missed',
      'cancelled',
      'rescheduled',
    ])
    .optional(),
  branchId: z.uuid().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

export const availableSlotsQuerySchema = z.object({
  doctorId: z.uuid(),
  branchId: z.uuid(),
  date: z.string().min(1),
});

export const createSlotSchema = z.object({
  doctorId: z.uuid(),
  branchId: z.uuid(),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
});

export const createBranchSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(3),
  phone: z.string().min(5),
});
