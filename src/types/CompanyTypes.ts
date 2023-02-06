export interface Company {
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

export interface CompanyRelation {
  companies_id: Company;
}
