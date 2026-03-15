import fs from 'fs';
import path from 'path';
import { format } from '@fast-csv/format';
import { DoctorCSVRow } from '../types/export.types';

export const generateDoctorCSV = async (rows: DoctorCSVRow[]) => {
  const exportDir = path.join(__dirname, '../../exports');

  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  const filePath = path.join(exportDir, `doctor-report-${Date.now()}.csv`);

  const ws = fs.createWriteStream(filePath);

  const csvStream = format({
    headers: ['AppointmentId', 'Patient', 'SlotDate', 'StartTime', 'Status'],
  });

  csvStream.pipe(ws);

  rows.forEach((row) => {
    csvStream.write({
      AppointmentId: row.appointmentId,
      Patient: row.patientName,
      SlotDate: row.slotDate,
      StartTime: row.startTime,
      Status: row.status,
    });
  });

  csvStream.end();

  await new Promise((resolve) => ws.on('finish', resolve));

  return filePath;
};
