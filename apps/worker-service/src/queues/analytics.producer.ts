import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

interface AnalyticsJobData {
  date: string;
}

export const analyticsQueue = new Queue<AnalyticsJobData>('analytics-queue', {
  connection: redisConnection,
});

export const publishDailyAnalytics = async (date: string) => {
  await analyticsQueue.add('analytics.daily', { date });
};
