import { Appointment } from '../models/external/appointment.model';

export const findAppointmentById = (appointmentId: string) => {
  return Appointment.findByPk(appointmentId);
};
