export interface TablePaginationProps {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}
