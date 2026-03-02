import type { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export interface StatusBadgeProps {
  status: string;
}

export interface DataTableProps {
  headers: string[];
  children: ReactNode;
}

export interface ConfirmDialogProps {
  trigger: ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
}
