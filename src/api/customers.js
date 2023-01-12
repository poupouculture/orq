import { api } from "boot/axios";

export const getCustomers = async ({ limit = 10, page = 1 }) => {
  const fields = `id, first_name, last_name`;
  const companies = `companies.companies_id.name_english`;

  const offset = page === 1 ? 0 : (page - 1) * limit;

  const customers = await api.get(`/items/customers`, {
    params: {
      fields: `${fields},${companies}`,
      sort: `-date_created`,
      limit,
      offset,
      meta: "*",
    },
  });

  console.log('customers ', customers);
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

export const updateCustomer = async (id, payload) => {
  const customer = await api.patch(`/items/customers/${id}`, payload);
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
