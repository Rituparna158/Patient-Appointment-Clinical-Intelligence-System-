import { Appointment } from '../../models/external/appointment.model';
import { DoctorSlot } from '../../models/external/doctorSlot.model';

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
      console.log(`Marked missed ${appointment.id}`);
    }
  }
};
