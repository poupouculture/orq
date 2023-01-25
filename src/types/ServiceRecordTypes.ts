export interface IMeta {
  total_count: number | string;
  filter_count: number | string;
}
export interface IPagination {
  sortBy: string;
  descending: boolean;
  page: number;
  rowsPerPage: number;
  totalCount: number;
}
export interface IState {
  items: string[];
  meta: IMeta;
  pagination: IPagination;
}
