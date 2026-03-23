import { Op } from 'sequelize';
import { ResolvedRange } from '../types/dashboard.types';

type RangeType = 'today' | 'week' | 'month' | 'year';

export const startOfToday = (): Date => {
  const now = new Date();

  const ist = new Date(
    now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  );

  ist.setHours(0, 0, 0, 0);

  return ist;
};

export const endOfToday = (): Date => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};
export const resolveDateRange = (range?: RangeType): ResolvedRange => {
  if (!range) return {};

  const now = new Date();

  const today = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  );

  if (range === 'today') {
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);

    const end = new Date(today);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  if (range === 'week') {
    const start = new Date(today);
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);

    return { start, end: today };
  }

  if (range === 'month') {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { start, end: today };
  }

  if (range === 'year') {
    const start = new Date(today.getFullYear(), 0, 1);
    return { start, end: today };
  }

  return {};
};

export const toDateOnly = (d?: Date) => {
  if (!d) return undefined;

  return d.toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kolkata',
  });
};

export const buildDateWhere = (
  from?: string,
  to?: string,
  range?: RangeType
): { [Op.gte]?: string; [Op.lte]?: string } | undefined => {
  const resolved = resolveDateRange(range);

  const start = from ?? toDateOnly(resolved.start);
  const end = to ?? toDateOnly(resolved.end);

  if (!start && !end) return undefined;

  const filter: any = {};

  if (start) filter[Op.gte] = start;
  if (end) filter[Op.lte] = end;

  return filter;
};
