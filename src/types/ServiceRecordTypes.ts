import { ICustomer } from "./CustomerTypes";
import { IEmployee } from "./EmployeeTypes";

export interface IServiceRecord {
  id: number | string;
  name: string;
  channel: string;
  company_name: string;
  customer_name: string;
  customer: ICustomer;
  employee: IEmployee;
  reference_number: number | string;
  type: string;
  sort: string;
  status: string;
  data_created: string;
}
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
  item: null;
  serviceRecords: null | IServiceRecord;
  meta: IMeta;
  pagination: IPagination;
}
