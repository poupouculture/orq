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
  { limit = 10, page = 1, search = undefined, type = undefined },
  id = null
) => {
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const url =
    id !== null ? "/items/customer_groups/" + id : "/items/customer_groups";
  const companies = "customers.customers_id.companies.companies_id.*";
  const userGroups = "user_groups.*, user_groups.user_groups_id.*";
  const tags = "tags.*, tags.*.*";
  const param = {
    limit,
    offset,
    search,
    fields: `id,name,status,customers.id,customers.customers_id.*,${userGroups},${companies},${tags}`,
    meta: "*",
  };
  if (type) {
    param["filter[type][_eq]"] = type;
  }
  const customerGroups = await api.get(url, {
    params: param,
  });
  return customerGroups;
};

export const getAllCustomerGroups = async () => {
  const result = await api.get(`/items/customer_groups`);
  return result;
};

export const getAllCustomerEdit = async (payload) => {
  const { limit, page, customers, search, filter } = payload;
  const fields = "id, first_name, last_name, gender, date_created, position";
  const companies = "companies.companies_id.name_english";

  const offset = page === 1 ? 0 : (page - 1) * limit;
  const filterField =
    filter && filter.key ? { [filter.key]: filter.value } : undefined;
  const customer = await api.get("/items/customers", {
    params: {
      "filter[id][_nin]": customers.map((c) => c.id).join(),
      fields: `${fields},${companies}`,
      sort: "-date_created",
      search,
      limit,
      ...filterField,
      offset,
      meta: "*",
    },
  });
  return customer;
};
export const getAllCustomerGroupEdit = async (payload) => {
  const { limit, page, customerGroups, search } = payload;
  const fields = "id, name, status, customer.id";
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const customerGroup = await api.get("/items/customer_groups", {
    params: {
      "filter[id][_nin]": customerGroups.join(),
      fields: `${fields}`,
      sort: "-date_created",
      search,
      limit,
      offset,
      meta: "*",
    },
  });
  return customerGroup;
};

export const getCustomersFilter = async (
  { limit = 10, page = 1, search = undefined, filter = undefined },
  ids
) => {
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const filterField =
    filter && filter.key ? { [filter.key]: filter.value } : undefined;
  const customer = await api.get("/items/customers", {
    params: {
      limit,
      offset,
      search,
      ...filterField,
      "filter[_and][0][id][_nin]": ids.join(),
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
    await api.patch("/items/customer_groups/" + id, {
      customers: {
        delete: [result.data[0].id],
      },
    });
  } catch (error) {}
};
