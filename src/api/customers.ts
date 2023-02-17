import { api } from "boot/axios";

interface CustomerPayload {
  limit: number;
  page: number;
}

export const getCustomers = async (payload: CustomerPayload) => {
  const { limit, page } = payload;
  const fields =
    "id, first_name, last_name, gender, date_created, position, customer_code";
  const companies = "companies.companies_id.name_english";
  const tags = "tags.tags_id.*";

  const offset = page === 1 ? 0 : (page - 1) * limit;

  const customers = await api.get("/items/customers", {
    params: {
      fields: `${fields},${companies},${tags}`,
      sort: "-date_created",
      limit,
      offset,
      meta: "*",
    },
  });

  return customers;
};

// get all customers who has contacts
export const getCustomersWithContacts = async () => {
  const fields =
    "id, first_name, last_name, gender, date_created, position, customer_code";
  const companies = "companies.companies_id.name_english";

  const customers = await api.get("/items/customers", {
    params: {
      fields: `${fields},${companies}`,
      sort: "-date_created",
      "filter[count(contacts)][_neq]": 0,
    },
  });

  return customers;
};

export const getCustomer = async (id: string) => {
  const fields = "*";
  const companies = "companies.*, companies.companies_id.*";
  const contacts = "contacts.contacts_id.*";
  const customerGroups =
    "customer_groups.*, customer_groups.customer_groups_id.*";
  const tags = "tags.*, tags.tags_id.*";

  const customer = await api.get(
    `/items/customers/${id}?fields=${fields},${companies},${contacts},${customerGroups},${tags}`
  );
  return customer;
};

export const addCustomer = async (payload) => {
  const customer = await api.post("/items/customers", payload);
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
