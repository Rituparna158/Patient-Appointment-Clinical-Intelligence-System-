import { useState } from 'react';
import { TABLE_DEFAULTS } from '@/constants/table.constants';

export function useTableQuery() {
  const [page, setPage] = useState(TABLE_DEFAULTS.PAGE);
  const [limit] = useState(TABLE_DEFAULTS.LIMIT);

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(TABLE_DEFAULTS.SORT_BY);
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  function handleSort(col: string) {
    if (sortBy === col) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(col);
      setSortOrder('ASC');
    }
  }

  return {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    status,
    fromDate,
    toDate,
    setPage,
    setSearch,
    setStatus,
    setFromDate,
    setToDate,
    handleSort,
  };
}
