import axios from "axios";
import { api } from "boot/axios";

interface CustomerPayload {
  limit: number;
  page?: number | null;
  search: string;
  filter?: {
    key: string;
    value: string;
  };
}

export const getCustomers = async (payload: CustomerPayload) => {
  const { limit, page, search = undefined, filter } = payload;
  const fields = "*";
  const companies = "companies.companies_id.name_english";
  const tags = "tags.tags_id.*";

  const offset = page === 1 ? 0 : (page - 1) * limit;

  const filterField =
    filter && filter.key ? { [filter.key]: filter.value } : undefined;
  const params = {
    fields: `${fields},${companies},${tags}`,
    sort: "-date_created",
    ...filterField,
    limit,
    offset,
    search,
    meta: "*",
  } as any;
  const customers = await api.get("/items/customers", {
    params,
  });

  return customers;
};

// get all customers who has contacts
export const getCustomersWithContacts = async (payload: CustomerPayload) => {
  const { limit, page, search } = payload;
  // console.log(limit);
  // const fields = "*";

  // const offset = search ? 0 : page === 1 ? 0 : (page - 1) * limit;

  // "/items/customers"
  // const customers = await api.get("/chat/valid-customers", {
  const customers = await api.get("/chat/contacts/valid", {
    params: {
      // fields: `${fields}`,
      // sort: "-date_created",
      // "filter[count(contacts)][_neq]": 0,
      limit,
      page,
      search,
      fields: "*.*",
      // meta: "*",
    },
  });

  return customers;
};

let cancelGetCustomerToken = undefined as any;
export const cancelGetCustomerRequest = () => {
  if (cancelGetCustomerToken) cancelGetCustomerToken.cancel();
};
export const getCustomer = async (id: string) => {
  console.log("fnc:getCustomer-----");
  const fields = "*";
  // const companies = "companies.*,companies.companies_id.*";
  const contacts =
    "contacts.contacts_id.id,contacts.contacts_id.first_name,contacts.contacts_id.last_name,contacts.contacts_id.number,contacts.contacts_id.status,contacts.contacts_id.category,contacts.contacts_id.preferred_language";
  // "contacts.contacts_id.*";
  // const customerGroups = "";
  // "customer_groups.*,customer_groups.customer_groups_id.*";
  const tags = "tags.*,tags.tags_id.*";

  const axiosSource = axios.CancelToken.source();
  cancelGetCustomerToken = { cancel: axiosSource.cancel };
  const customer = await api.get(
    `/items/customers/${id}?fields=${fields},${contacts},${tags}`,
    // `/items/customers/${id}?fields=${fields},${companies},${contacts},${tags}`,
    // `/items/customers/${id}?fields=${fields},${companies},${contacts},${customerGroups},${tags}`,
    {
      cancelToken: axiosSource.token,
    }
  );
  return customer;
};

export const deleteCustomer = async (payload: string[]) => {
  return await api.delete("/items/customers", {
    data: payload,
  });
};

export const addCustomer = async (payload: any) => {
  const companies = "companies.*,companies.companies_id.*";
  const contacts = "contacts.contacts_id.*";
  const customerGroups =
    "customer_groups.*,customer_groups.customer_groups_id.*";
  const tags = "tags.*,tags.tags_id.*";
  const customer = await api.post(
    `/items/customers?fields=*,${companies},${contacts},${customerGroups},${tags}`,
    payload
  );
  return customer;
};

export const updateCustomer = async (id, payload) => {
  const customer = await api.patch(`/items/customers/${id}`, payload);
  return customer;
};

export const addContact = async (payload) => {
  const contact = await api.post("/items/contacts", payload);
  return contact;
};

export const addCustomerContact = async (customerId, contactId) => {
  const customerContact = await api.post("/items/contacts_customers", {
    customers_id: customerId,
    contacts_id: contactId,
  });
  return customerContact;
};

export const addCustomerContactAlong = async (payload) => {
  const customerContact = await api.post("/chat/contact/associate", payload);
  return customerContact;
};

export const searchCustomers = async (payload: any) => {
  const data = await api.get("/items/customers", {
    params: {
      ...payload,
    },
  });
  return data;
};
/*
  delete relation data from customer
  (customer relation data) eq: customer_groups
*/
export const deleteCustomerRelationship = async (customerId, contactId) => {
  const customerContact = await api.post("/items/contacts_customers", {
    customers_id: customerId,
    contacts_id: contactId,
  });
  return customerContact;
};
