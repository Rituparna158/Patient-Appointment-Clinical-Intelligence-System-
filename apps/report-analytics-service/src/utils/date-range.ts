import { Op } from 'sequelize';
import { ResolvedRange } from '../types/dashboard.types';

type RangeType = 'today' | 'week' | 'month' | 'year';

export const startOfToday = (): Date => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const endOfToday = (): Date => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

export const resolveDateRange = (range?: RangeType): ResolvedRange => {
  if (!range) return {};

  const now = new Date();

  if (range === 'today') {
    return {
      start: startOfToday(),
      end: endOfToday(),
    };
  }

  if (range === 'week') {
    const start = new Date(now);
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
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

export const toDateOnly = (d?: Date) => {
  if (!d) return undefined;
  return d.toISOString().split('T')[0];
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
