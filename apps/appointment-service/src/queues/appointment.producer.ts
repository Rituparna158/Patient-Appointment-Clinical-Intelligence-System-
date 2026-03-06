import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const appointmentQueue = new Queue('appointment-queue', {
  connection: redisConnection,
});

export const publishAppointmentConfirmed = async (appointmentId: string) => {
  await appointmentQueue.add('appointment.confirmed', {
    appointmentId,
  });
};
