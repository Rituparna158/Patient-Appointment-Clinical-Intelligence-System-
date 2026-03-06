import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const clinicalQueue = new Queue('clinical-queue', {
  connection: redisConnection,
});

export const publishConsultationCreated = async (consultationId: string) => {
  await clinicalQueue.add('consultation.created', {
    consultationId,
  });
};
