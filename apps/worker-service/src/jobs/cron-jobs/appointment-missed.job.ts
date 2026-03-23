import { Appointment } from '@repo/shared-database';
import { DoctorSlot } from '@repo/shared-database';

export const markMissedAppointments = async () => {
  const confirmedAppointments = await Appointment.findAll({
    where: { status: 'confirmed' },
  });

  for (const appointment of confirmedAppointments) {
    const slot = await DoctorSlot.findByPk(appointment.slotId);
    if (!slot) continue;

    const slotEnd = new Date(`${slot.slotDate}T${slot.endTime}`);
    if (slotEnd < new Date()) {
      appointment.status = 'missed';
      await appointment.save();
    }
  }
};
