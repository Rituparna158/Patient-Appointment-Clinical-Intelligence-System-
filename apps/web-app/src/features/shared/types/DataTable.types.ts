import type { SortOrder } from '@/types/table.types';
import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortable?: boolean;
}

export interface Props<T> {
  data: T[];
  columns: Column<T>[];
  selected: string[];
  onSelect: (id: string) => void;
  sortBy?: string;
  sortOrder?: SortOrder;
  onSort?: (column: string) => void;
}
