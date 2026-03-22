import type { Notification } from '@/types/notification.types';

import type {
  Doctor,
  Branch,
  Slot,
  Appointment,
} from '@/types/appointment.types';

const now = '2026-03-22T10:00:00.000Z';

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'reminder', // ✅ correct enum
    message: 'Appointment confirmed',
    status: 'pending', // ✅ correct enum
    scheduledAt: now,
    sentAt: null,
  },
];

export const mockDoctors: Doctor[] = [
  {
    id: 'd1',
    specialization: 'Cardiologist',
    user: {
      id: 'u1',
      full_name: 'Dr. John Doe',
      email: 'john@example.com',
    },
  },
];

export const mockBranches: Branch[] = [
  {
    id: 'b1',
    name: 'Main Branch',
    address: 'Bhubaneswar',
    phone: '9999999999',
  },
];

export const mockSlots: Slot[] = [
  {
    id: 's1',
    doctorId: 'd1',
    branchId: 'b1',
    slotDate: '2026-03-22',
    startTime: '10:00:00',
    endTime: '10:30:00',
  },
];

export const mockAppointment: Appointment = {
  id: 'a1',
  patientId: 'p1',
  doctorId: 'd1',
  branchId: 'b1',
  slotId: 's1',

  status: 'confirmed',
  paymentStatus: 'paid',

  createdAt: now,
  updatedAt: now,

  doctor: {
    id: 'd1',
    user: {
      id: 'u1',
      full_name: 'Dr. John Doe',
      email: 'john@example.com',
    },
  },

  slot: {
    id: 's1',
    slotDate: '2026-03-22',
    startTime: '10:00:00',
    endTime: '10:30:00',
  },
};
