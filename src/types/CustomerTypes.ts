export interface FormPayload {
  first_name: string;
  last_name: string;
  id_number: string;
  customer_code: string;
  gender: string;
  isActive: boolean;
  dob: string;
}

interface Company {
  company_number: string;
  country: string;
  date_created: string;
  date_of_cessation: string;
  date_of_commencement: string;
  date_of_expiry: string;
  date_of_incorporation: string;
  date_updated: string;
  download_status: string;
  id: number | string;
  last_update_by: string;
  name_chinese: string;
  name_english: string;
  status: string;
  user_created: string;
}

interface CompanyRelation {
  companies_id: Company;
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
  companies?: [CompanyRelation];
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
  isActive: null | boolean;
  last_name: string;
  position: string;
  service_records?: [string];
  status: string;
  user_created: string;
  user_updated: string;
}

export interface IState {
  customer: ICustomer;
}
