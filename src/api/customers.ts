import { api } from "boot/axios";

interface CustomerPayload {
  limit: number;
  page: number;
}

export const getCustomers = async (payload: CustomerPayload) => {
  const { limit, page } = payload;
  const fields = "id, first_name, last_name, gender, date_created, position";
  const companies = "companies.companies_id.name_english";

  const offset = page === 1 ? 0 : (page - 1) * limit;

  const customers = await api.get("/items/customers", {
    params: {
      fields: `${fields},${companies}`,
      sort: "-date_created",
      limit,
      offset,
      meta: "*",
    },
  });

  return customers;
};

export const getCustomer = async (id: string) => {
  const fields = "*";
  const companies = "companies.companies_id.*";
  const contacts = "contacts.contacts_id.*";

  const customer = await api.get(
    `/items/customers/${id}?fields=${fields},${companies},${contacts}`
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
