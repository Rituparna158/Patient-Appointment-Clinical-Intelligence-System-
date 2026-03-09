import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import { generateDailyAnalytics } from '../jobs/queue-jobs/analytics.job';

interface AnalyticsJobData {
  date: string;
}

export const analyticsWorker = new Worker<AnalyticsJobData>(
  'analytics-queue',
  async (job) => {
    if (job.name === 'analytics.daily') {
      await generateDailyAnalytics(job.data.date);
      console.log(`Analytics generated for ${job.data.date}`);
    }
  },
  { connection: redisConnection }
);
