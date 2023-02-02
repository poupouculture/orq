import { api } from "src/boot/axios";

export const getServiceRecords = async ({ limit = 10, page = 1 }) => {
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const serviceRecord = await api.get("/items/service_references", {
    params: {
      limit,
      offset,
      fields: "*",
      meta: "*",
    },
  });
  return serviceRecord;
};
