import { Notify } from "quasar";
import { api } from "src/boot/axios";

export const getServiceReferences = async (
  { limit = 10, page = 1 },
  id?: string
) => {
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const sort = id ? "service_records.date_created" : "-date_created";
  const fields = id
    ? "*, service_records.*, service_records.employee.first_name, service_records.employee.last_name"
    : "*, employee.first_name, employee.last_name";
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
export const getServiceRecords = async (id: string) => {
  return await api.get("/items/service_records", {
    params: {
      fields: "*, employee.first_name, employee.last_name",
      sort: "date_created",
      "filter[service_reference][_eq]": id,
    },
  });
};
export const addServiceReference = async (payload: any) => {
  try {
    const { data } = await api.post("/items/service_references", payload);
    return data;
  } catch (error: any) {
    Notify.create({
      message: "Error: " + error,
      type: "error",
    });
  }
};
