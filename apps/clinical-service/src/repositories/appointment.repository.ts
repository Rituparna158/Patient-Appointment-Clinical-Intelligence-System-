import { Appointment } from '@repo/shared-database';

export const findAppointmentById = (appointmentId: string) => {
  return Appointment.findByPk(appointmentId);
};
