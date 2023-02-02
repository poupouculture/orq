import { api } from "src/boot/axios";

export const getServiceReferences = async (
  { limit = 10, page = 1 },
  id?: string
) => {
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const sort = id
    ? "-date_created,service_records.date_created"
    : "-date_created";
  const fields = id
    ? "*, service_records.*, service_records.employee.first_name, service_records.employee.last_name"
    : "*";
  const params = {
    limit,
    offset,
    fields,
    sort,
    meta: "*",
  };
  const url = id
    ? "/items/service_references/" + id
    : "/items/service_references";
  const serviceRecord = await api.get(url, {
    params,
  });
  return serviceRecord;
};
