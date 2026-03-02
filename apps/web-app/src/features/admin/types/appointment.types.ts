import type { Appointment } from '@/types/appointment.types';

export interface AppointmentTableProps {
  appointments: Appointment[];
  onCancel: (id: string) => void;
}
