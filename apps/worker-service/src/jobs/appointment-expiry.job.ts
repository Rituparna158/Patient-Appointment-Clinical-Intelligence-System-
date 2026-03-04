import cron from 'node-cron';
import { Op } from 'sequelize';
import { Appointment } from '../models/external/appointment.model';
import { DoctorSlot } from '../models/external/doctorSlot.model';
import { app } from '../app';

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

    console.log(` Cancelled unpaid appointment : ${appointment.id}`);
  }
};
