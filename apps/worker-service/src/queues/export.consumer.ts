import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import { ReportJobData } from '../types/export.types';

import { findExportRows } from '../repositories/export.repository';
import { generateCSV } from '../utils/csv.generator';
import { sendEmail } from '../utils/email.util';

export const reportWorker = new Worker<ReportJobData>(
  'report-queue',
  async (job) => {
    console.log('report job received:', job.name, job.data);

    const rows = await findExportRows(job.data.from, job.data.to);

    const filePath = await generateCSV(rows);
    console.log('email send function finished:', job.data.email);

    if (job.data.email) {
      await sendEmail(
        job.data.email!,
        'Analytics Report',
        'Please find attached analytics report',
        filePath
      );
    }

    console.log('Analytics report generated:', filePath);
  },
  { connection: redisConnection }
);
