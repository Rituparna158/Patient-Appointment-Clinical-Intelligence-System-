import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';

import { ClinicalJobData } from '../types/clinical.job.types';

import { sendFollowupReminder } from '../jobs/queue-jobs/clinical.job';
import { Patient } from '../models';
import { Notification } from '../models/external/notification.model';
import { ConsultaionNote } from '../models';
import { Appointment } from '../models';

export const clinicalWorker = new Worker<ClinicalJobData>(
  'clinical-queue',
  async (job) => {
    if (job.name === 'consultation.followup') {
      const note = await ConsultaionNote.findByPk(job.data.consultationId, {
        include: [
          {
            model: Appointment,
            as: 'appointment',
          },
        ],
      });

      if (!note) return;

      const appointment = (note as any).appointment;

      if (!appointment) return;

      const patient = await Patient.findByPk(appointment.patientId);

      if (!patient) return;

      await Notification.create({
        appointmentId: appointment.id,
        userId: patient.userId,
        type: 'follow_up',
        message: 'Follow-up scheduled',
        scheduledAt: note.followUpDate ?? new Date(),
      });

      await sendFollowupReminder(job.data.consultationId);
    }
  },
  { connection: redisConnection }
);
