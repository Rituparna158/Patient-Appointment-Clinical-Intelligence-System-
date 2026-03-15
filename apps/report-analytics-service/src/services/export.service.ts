import { generateAdminCSV } from '../utils/csv.generator';
import { generateDoctorCSV } from '../utils/doctor-csvgenerator';

import {
  findAdminExportRows,
  findDoctorExportRows,
} from '../repositories/export.repository';

import { publishExportReport } from '../queues/export.producer';

export const requestExport = async (
  range: 'today' | 'week' | 'month' | 'year',
  from: string | undefined,
  to: string | undefined,
  delivery: 'download' | 'email',
  userId: string,
  email?: string
) => {
  const rows = await findAdminExportRows(range, from, to);

  if (delivery === 'download') {
    const filePath = await generateAdminCSV(rows);

    return { filePath };
  }

  await publishExportReport({
    range,
    from,
    to,
    role: 'admin',
    delivery,
    userId,
    email,
  });

  return {
    message: 'Export job added to queue',
  };
};

export const requestDoctorExport = async (
  doctorId: string,
  delivery: 'download' | 'email',
  email?: string
) => {
  const rows = await findDoctorExportRows(doctorId);

  if (delivery === 'download') {
    const filePath = await generateDoctorCSV(rows);

    return { filePath };
  }

  await publishExportReport({
    role: 'doctor',
    doctorId,
    delivery,
    email,
    userId: doctorId,
  });

  return {
    message: 'Doctor export queued',
  };
};
