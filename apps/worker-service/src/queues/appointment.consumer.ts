import { Worker, Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

import { AppointmentJobData } from '../types/appointment.job.types';

import {
  sendAppointmentConfirmation,
  sendAppointmentReminder,
} from '../jobs/queue-jobs/appointment.jobs';

import { Appointment } from '../models/external/appointment.model';
import { DoctorSlot } from '../models/external/doctorSlot.model';

const appointmentQueue = new Queue<AppointmentJobData>('appointment-queue', {
  connection: redisConnection,
});

export const appointmentWorker = new Worker<AppointmentJobData>(
  'appointment-queue',
  async (job) => {
    console.log('job received:', job.name, job.data);

    if (job.name === 'appointment.confirmed') {
      await sendAppointmentConfirmation(job.data.appointmentId);

      const appointment = await Appointment.findByPk(job.data.appointmentId, {
        include: [
          {
            model: DoctorSlot,
            as: 'slot',
          },
        ],
      });

      if (!appointment) return;

      const slot = (appointment as any).slot;

      if (!slot) return;

      // TEST MODE → reminder after 1 minute
      const delay = 60 * 1000;

      await appointmentQueue.add(
        'appointment.reminder',
        { appointmentId: job.data.appointmentId },
        { delay }
      );

      console.log('Reminder scheduled in 1 minute');
    }

    if (job.name === 'appointment.reminder') {
      await sendAppointmentReminder(job.data.appointmentId);
    }
  },
  { connection: redisConnection }
);
