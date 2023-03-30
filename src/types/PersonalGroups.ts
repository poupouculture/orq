export interface PersonalItem {
  id: string;
  name: string;
  status: string;
}

export interface Meta {
  filter_count: number;
  total_count: number;
}

export interface Customer {
  customer_groups_id: PersonalItem;
}

export interface Personal extends PersonalItem {
  customer_groups: Customer[];
}

export interface PersonalGroups {
  data: Personal[];
  meta: Meta;
}

export interface PState {
  personalGroups: PersonalGroups;
  customerGroups: PersonalItem[];
}