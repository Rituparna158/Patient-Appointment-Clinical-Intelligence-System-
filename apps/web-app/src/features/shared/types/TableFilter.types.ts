export interface TableFilterProps {
  status?: string;
  setStatus?: (value: string) => void;
  fromDate?: string;
  toDate?: string;
  setFromDate: (value: string) => void;
  setToDate: (value: string) => void;
}
