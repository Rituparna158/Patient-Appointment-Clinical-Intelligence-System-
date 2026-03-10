import { publishExportReport } from '../queues/export.producer';
import { findExportRows } from '../repositories/export.repository';
import { generateCSV } from '../utils/csv.generator';

export const requestExport = async (
  type: 'daily' | 'monthly',
  from: string | undefined,
  to: string | undefined,
  delivery: 'download' | 'email',
  userId: string,
  email?: string
) => {
  if (delivery === 'download') {
    const rows = await findExportRows(from, to);

    const filePath = await generateCSV(rows);

    return { filePath };
  }

  await publishExportReport({
    type,
    from,
    to,
    delivery,
    userId,
    email,
  });

  return {
    message: 'Export job added to queue',
  };
};
