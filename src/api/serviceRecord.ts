import { api } from "src/boot/axios";

export const getServiceRecords = async ({ limit = 10, page = 1 }) => {
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const internalGroups = await api.get("/items/service_records", {
    params: {
      limit,
      offset,
      fields: "*",
      meta: "*",
    },
  });
  return internalGroups;
};
