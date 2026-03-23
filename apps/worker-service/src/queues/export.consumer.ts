import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis';

import { ReportJobData } from '../types/export.types';

import {
  findAdminExportRows,
  findDoctorExportRows,
} from '../repositories/export.repository';

import { generateAdminCSV } from '../utils/csv.generator';
import { generateDoctorCSV } from '../utils/doctor.csvgenerator';

import { sendEmail } from '../utils/email.util';
import { logger } from '@repo/shared-utils';

export const reportWorker = new Worker<ReportJobData>(
  'report-queue',
  async (job) => {
    try {
      const { range, from, to, email, role, doctorId } = job.data;

      let filePath = '';

      if (role === 'admin') {
        const rows = await findAdminExportRows(range, from, to);
        filePath = await generateAdminCSV(rows);
      }

      if (role === 'doctor' && doctorId) {
        const rows = await findDoctorExportRows(doctorId);
        filePath = await generateDoctorCSV(rows);
      }

      if (email && filePath) {
        await sendEmail(
          email,
          'Clinic Analytics Report',
          'Please find attached analytics report.',
          filePath
        );
      }
    } catch (err) {
      logger.error({ err }, 'Worker error:');
    }
  },
  {
    connection: redisConnection,
  }
);
