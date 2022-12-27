import { api } from "boot/axios";

export const getCustomers = async () => {
  const customers = await api.get("/items/customers");
  return customers;
};
