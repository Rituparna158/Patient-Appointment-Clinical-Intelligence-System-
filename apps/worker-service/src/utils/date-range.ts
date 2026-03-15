import { RangeType } from '../types/export.types';

export const resolveRange = (range?: RangeType) => {
  if (!range) return {};

  const now = new Date();

  if (range === 'today') {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  if (range === 'week') {
    const start = new Date();
    start.setDate(now.getDate() - 7);

    return { start, end: now };
  }

  if (range === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    return { start, end: now };
  }

  if (range === 'year') {
    const start = new Date(now.getFullYear(), 0, 1);

    return { start, end: now };
  }

  return {};
};
