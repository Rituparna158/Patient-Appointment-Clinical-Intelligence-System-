import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';
import { ExportQuery } from '../types/export.types';

export const reportQueue = new Queue<ExportQuery>('report-queue', {
  connection: redisConnection,
});

export const publishExportReport = async (data: ExportQuery) => {
  await reportQueue.add('analytics.export', data);
};
