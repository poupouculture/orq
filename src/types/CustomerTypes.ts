import { CompanyRelation } from "./CompanyTypes";
import { ICustomerGroup } from "./CustomerGroupTypes";
import { TagRelation } from "./TagTypes";

export interface FormPayload {
  first_name: string;
  last_name: string;
  id_number: string;
  customer_code: string;
  gender: string;
  isActive: boolean;
  dob: string;
  remarks: string;
}

interface Contact {
  id: string;
  number: string;
}

interface ContactRelation {
  contacts_id: Contact;
}

type Gender = "m" | "f";

export interface ICustomer {
  companies?: [CompanyRelation] | any;
  contacts?: [ContactRelation];
  customer_code?: string;
  date_created?: string;
  date_updated?: string;
  dob?: string;
  email?: string;
  first_name?: string;
  gender?: Gender | any;
  id?: string;
  id_number?: string;
  isActive?: boolean;
  last_name?: string;
  position?: any;
  remarks?: string;
  service_records?: [string];
  status?: string;
  user_created?: string;
  user_updated?: string;
  customer_groups?: ICustomerGroup[] | any;
  tags?: [TagRelation] | any;
  is_active?: boolean;
  tel?: null | number | string;
  location_code?: null | number;
  delivery_location_address?: null | string;
  customer_company_name_en?: null | string;
  customer_company_name_zht?: null | string;
  cust_cd?: null | string;
  delyloc_no?: null | string;
  div_no?: null | string;
  delyloc_name_e?: null | string;
  delyloc_name_c?: null | string;
  delivery_address_en?: null | string;
  delivery_address_zht?: null | string;
  delyloc_add1_e?: null | string;
  delyloc_add2_e?: null | string;
  delyloc_add3_e?: null | string;
  delyloc_add1_c?: null | string;
  delyloc_add2_c?: null | string;
  delyloc_add3_c?: null | string;
  salesman_cd?: null | string;
  last_modify_date?: null | string;
  company_cd?: null | string;
}

export interface IState {
  customer: ICustomer;
  user: {
    first_name: string;
    last_name: string;
  };
  resetForm: boolean;
}
