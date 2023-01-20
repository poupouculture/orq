import { api } from "src/boot/axios";

export const getCutomerGroups = async ({ limit = 10, page = 1 }) => {
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const customerGroups = await api.get("/items/customer_groups", {
    params: {
      limit,
      offset,
      fields: "name, status, customers.customers_id.*, user_groups.*",
    },
  });
  return customerGroups;
};

export const addCustomerGroup = async (payload) => {
  const customer = await api.post("/items/customer_groups", payload);
  return customer;
};
