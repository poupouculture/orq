import { api } from "boot/axios";

export const getCustomerServiceTemplates = async ({
  limit = 10,
  page = 1,
  status = "*",
}) => {
  const fields = `*, users.*`;

  const offset = page === 1 ? 0 : (page - 1) * limit;

  const params = {
    fields: `${fields}`,
    sort: `-date_created`,
    limit,
    offset,
    meta: "*",
  };

  if (status !== "*") params["filter[is_approved][_eq]"] = true;

  const templates = await api.get(`/items/customer_service_templates`, {
    params,
  });

  return templates;
};

export const getCustomerServiceTemplate = async (id) => {
  const fields = `*`;

  const applicationProgram = await api.get(
    `/items/customer_service_templates/${id}?fields=${fields}`
  );
  return applicationProgram;
};

export const addCustomerServiceTemplate = async (payload) => {
  const applicationProgram = await api.post(
    "/items/customer_service_templates",
    payload
  );
  return applicationProgram;
};

export const updateCustomerServiceTemplate = async (id, payload) => {
  const applicationProgram = await api.patch(
    `/items/customer_service_templates/${id}`,
    payload
  );
  return applicationProgram;
};
