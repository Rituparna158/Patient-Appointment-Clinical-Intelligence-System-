import fs from 'fs';
import path from 'path';
import { format } from '@fast-csv/format';
import { AdminCSVRow } from '../types/export.types';

export const generateAdminCSV = async (rows: AdminCSVRow[]) => {
  const exportDir = path.join(__dirname, '../../exports');

  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  const filePath = path.join(exportDir, `admin-report-${Date.now()}.csv`);

  const ws = fs.createWriteStream(filePath);

  const csvStream = format({
    headers: [
      'Date',
      'Doctor',
      'Patient',
      'Status',
      'SlotDate',
      'StartTime',
      'TotalAppointments',
      'CompletedAppointments',
      'CancelledAppointments',
      'MissedAppointments',
      'NewPatients',
      'UniquePatients',
      'FollowUpsScheduled',
    ],
  });

  csvStream.pipe(ws);

  rows.forEach((row) => {
    csvStream.write({
      Date: row.date,
      Doctor: row.doctorName,
      Patient: row.patientName,
      Status: row.appointmentStatus,
      SlotDate: row.slotDate,
      StartTime: row.startTime,
      TotalAppointments: row.totalAppointments,
      CompletedAppointments: row.completedAppointments,
      CancelledAppointments: row.cancelledAppointments,
      MissedAppointments: row.missedAppointments,
      NewPatients: row.newPatients,
      UniquePatients: row.uniquePatients,
      FollowUpsScheduled: row.followUpsScheduled,
    });
  });

  csvStream.end();

  await new Promise((resolve) => ws.on('finish', resolve));

  return filePath;
};
