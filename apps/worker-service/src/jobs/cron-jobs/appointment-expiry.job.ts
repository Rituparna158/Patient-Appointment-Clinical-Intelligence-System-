import cron from 'node-cron';
import { Op } from 'sequelize';
import { Appointment } from '@repo/shared-database';
export const cancelUnpaidAppointments = async () => {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  const expiredAppointments = await Appointment.findAll({
    where: {
      status: 'requested',
      paymentStatus: 'pending',
      createdAt: {
        [Op.lt]: fifteenMinutesAgo,
      },
    },
  });

  for (const appointment of expiredAppointments) {
    appointment.status = 'cancelled';
    appointment.paymentStatus = 'failed';
    await appointment.save();
  }
};
