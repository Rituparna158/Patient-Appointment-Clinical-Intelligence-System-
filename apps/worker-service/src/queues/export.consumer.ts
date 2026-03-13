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

export const reportWorker = new Worker<ReportJobData>(
  'report-queue',
  async (job) => {
    try {
      console.log('Export job received:', job.name);
      console.log('Job data:', job.data);

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

      console.log('email:', email);
      console.log('filepath:', filePath);

      if (email && filePath) {
        await sendEmail(
          email,
          'Clinic Analytics Report',
          'Please find attached analytics report.',
          filePath
        );
      }
    } catch (err) {
      console.error('Worker error:', err);
    }
  },
  {
    connection: redisConnection,
  }
);
