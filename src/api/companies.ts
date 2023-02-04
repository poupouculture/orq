import { api } from "boot/axios";

export const getCompanies = async () => {
  const result = await api.get(`/items/companies`);
  return result;
};
