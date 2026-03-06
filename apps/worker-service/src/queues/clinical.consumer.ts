import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';

import { ClinicalJobData } from '../types/clinical.job.types';

import { sendFollowupReminder } from '../jobs/queue-jobs/clinical.job';

export const clinicalWorker = new Worker<ClinicalJobData>(
  'clinical-queue',
  async (job) => {
    if (job.name === 'consultation.followup') {
      await sendFollowupReminder(job.data.consultationId);
    }
  },
  { connection: redisConnection }
);
