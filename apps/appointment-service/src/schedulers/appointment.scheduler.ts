import cron from 'node-cron';
import { Op } from 'sequelize';
import { Appointment } from '../models/appointment.model';
import { DoctorSlot } from '../models/doctorSlot.model';

cron.schedule('* * * * *', async () => {
  const now = new Date();

  console.log('Running appointment scheduler...');

  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

  await Appointment.update(
    { status: 'cancelled', paymentStatus: 'failed' },
    {
      where: {
        status: 'requested',
        paymentStatus: 'pending',
        createdAt: {
          [Op.lt]: fifteenMinutesAgo,
        },
      },
    }
  );

  const confirmedAppointments = await Appointment.findAll({
    where: {
      status: 'confirmed',
    },
    include: [
      {
        model: DoctorSlot,
        as: 'slot',
      },
    ],
  });

  for (const appointment of confirmedAppointments) {
    const slot = (appointment as any).slot;

    if (!slot) continue;

    if (new Date(slot.endTime) < now) {
      appointment.status = 'missed';
      await appointment.save();
    }
  }
});
