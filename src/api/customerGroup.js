import { api } from "src/boot/axios";
const customerCreate = ({ id = "+", customers }) => {
  return customers.map((customer) => {
    return {
      customer_groups_id: id,
      customers_id: customer,
    };
  });
};
export const getCustomerGroups = async ({ limit = 10, page = 1 }) => {
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const customerGroups = await api.get("/items/customer_groups", {
    params: {
      limit,
      offset,
      fields: "id, name, status, customers.customers_id.*, user_groups.*",
      meta: "*",
    },
  });
  return customerGroups;
};

export const getCustomerGroupFilter = async ({ limit = 10, page = 1 }, id) => {
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
