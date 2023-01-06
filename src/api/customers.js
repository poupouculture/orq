import { api } from "boot/axios";

export const getCustomers = async () => {
  const fields = `id, first_name, last_name`;
  const companies = `companies.companies_id.name_english`;

  const customers = await api.get(
    `/items/customers?fields=${fields},${companies}&sort=-date_created`
  );
  return customers;
};

export const getCustomer = async (id) => {
  const fields = `*`;
  const companies = `companies.companies_id.*`;
  const contacts = `contacts.contacts_id.*`;

  const customer = await api.get(
    `/items/customers/${id}?fields=${fields},${companies},${contacts}`
  );
  return customer;
};

export const addCustomer = async (payload) => {
  const customer = await api.post("/items/customers", payload);
  return customer;
};

export const addContact = async (payload) => {
  const contact = await api.post(`/items/contacts`, payload);
  return contact;
};

export const addCustomerContact = async (customerId, contactId) => {
  const customerContact = await api.post(`/items/customers_contacts`, {
    customers_id: customerId,
    contacts_id: contactId,
  });
  return customerContact;
};
