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
  companies: [CompanyRelation];
  contacts: [ContactRelation];
  customer_code: string;
  date_created: string;
  date_updated: string;
  dob: string;
  email: string;
  first_name: string;
  gender: Gender;
  id: string;
  id_number: string;
  isActive: boolean;
  last_name: string;
  position: string;
  service_records?: [string];
  status: string;
  user_created: string;
  user_updated: string;
  customer_groups: ICustomerGroup[];
  tags: [TagRelation];
}

export interface IState {
  customer: ICustomer;
}
