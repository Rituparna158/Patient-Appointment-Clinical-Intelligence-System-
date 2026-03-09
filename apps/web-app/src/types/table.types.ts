export type SortOrder = 'ASC' | 'DESC';

export interface TableQuery {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface AppointmentTableQuery extends TableQuery {
  status?: string;
  branchId?: string;
  fromDate?: string;
  toDate?: string;
}
