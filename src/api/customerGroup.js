import { api } from "src/boot/axios";
const customerCreate = ({ id = "+", customers }) => {
  return customers.map((customer) => {
    return {
      customer_groups_id: id,
      customers_id: customer,
    };
  });
};

export const getCustomerGroups = async (
  { limit = 10, page = 1 },
  id = null
) => {
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const url =
    id !== null ? "/items/customer_groups/" + id : "/items/customer_groups";
  const customerGroups = await api.get(url, {
    params: {
      limit,
      offset,
      fields:
        "id, name, status, customer.id, customers.customers_id.*, user_groups.*",
      meta: "*",
    },
  });
  return customerGroups;
};

export const getAllCustomerGroups = async () => {
  const result = await api.get(`/items/customer_groups`);
  return result;
};

export const getAllCustomerEdit = async (payload) => {
  const { limit, page, customers } = payload;
  const fields = "id, first_name, last_name, gender, date_created, position";
  const companies = "companies.companies_id.name_english";

  const offset = page === 1 ? 0 : (page - 1) * limit;
  const customer = await api.get("/items/customers", {
    params: {
      "filter[id][_nin]": customers.join(),
      fields: `${fields},${companies}`,
      sort: "-date_created",
      limit,
      offset,
      meta: "*",
    },
  });
  return customer;
};
export const getAllCustomerGroupEdit = async (payload) => {
  const { limit, page, customerGroups } = payload;
  const fields = "id, name, status, customer.id";
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const customerGroup = await api.get("/items/customer_groups", {
    params: {
      "filter[id][_nin]": customerGroups.join(),
      fields: `${fields}`,
      sort: "-date_created",
      limit,
      offset,
      meta: "*",
    },
  });
  return customerGroup;
};

export const getCustomersFilter = async ({ limit = 10, page = 1 }, id) => {
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const customer = await api.get("/items/customers", {
    params: {
      limit,
      offset,
      "filter[_and][0][$FOLLOW(customer_groups_customers,customers_id)][_none][customer_groups_id][_eq]":
        id,
      fields: "*, companies.companies_id.name_english",
      meta: "*",
    },
  });
  return customer;
};

export const addCustomerGroup = async (payload) => {
  const customer = await api.post("/items/customer_groups", payload);
  return customer;
};

export const updateCustomerGroup = async (id, payload) => {
  const customer = await api.patch("/items/customer_groups/" + id, payload);
  return customer;
};

export const addCustomerToCustomerGroup = async (payload) => {
  const customer = await api.patch("/items/customer_groups/" + payload.id, {
    customers: {
      create: customerCreate(payload),
    },
  });
  return customer;
};

export const deleteCustomerGroup = async (id) => {
  const customer = await api.delete("/items/customer_groups/" + id);
  return customer;
};

export const deleteCustomer = async (id, customerId) => {
  try {
    const { data: result } = await api.get("/items/customer_groups_customers", {
      params: {
        "filter[customer_groups_id][_eq]": id,
        "filter[customers_id][_eq]": customerId,
      },
    });
    const customer = await api.patch("/items/customer_groups/" + id, {
      customers: {
        delete: [result.data[0].id],
      },
    });
    return customer;
  } catch (error) {}
};
