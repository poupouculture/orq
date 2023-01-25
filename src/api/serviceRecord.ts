import { api } from "src/boot/axios";

export const getServiceRecords = async ({ limit = 10, page = 1 }) => {
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const serviceRecord = await api.get("/items/service_records", {
    params: {
      limit,
      offset,
      fields:
        "*, customer.first_name, customer.last_name, employee.first_name, employee.last_name",
      meta: "*",
    },
  });
  return serviceRecord;
};
