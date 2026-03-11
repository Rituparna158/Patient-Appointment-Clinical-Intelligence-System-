import fs from 'fs';
import path from 'path';
import { CSVRow } from '../types/export.types';

export const generateCSV = async (rows: CSVRow[]) => {
  const headers = [
    'Date',
    'TotalAppointments',
    'Completed',
    'Cancelled',
    'Missed',
    'NewPatients',
    'UniquePatients',
    'FollowUps',
  ];

  const csvRows = rows.map((r) => [
    r.date,
    r.totalAppointments,
    r.completedAppointments,
    r.cancelledAppointments,
    r.missedAppointments,
    r.newPatients,
    r.uniquePatients,
    r.followUpsScheduled,
  ]);

  const csv = [headers.join(','), ...csvRows.map((row) => row.join(','))].join(
    '\n'
  );

  const exportDir = path.resolve(__dirname, '../../exports');
  console.log('__dirname:', __dirname);
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  const filePath = path.join(exportDir, `report-${Date.now()}.csv`);

  fs.writeFileSync(filePath, csv);

  return filePath;
};
