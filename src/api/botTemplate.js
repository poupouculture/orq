import { api } from "boot/axios";

export const getBotTemplates = async ({
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

  const templates = await api.get(`/items/bot_templates`, {
    params,
  });

  return templates;
};

export const getBotTemplate = async (id) => {
  const fields = `*`;

  const applicationProgram = await api.get(
    `/items/bot_templates/${id}?fields=${fields}`
  );
  return applicationProgram;
};

export const addBotTemplate = async (payload) => {
  const applicationProgram = await api.post("/items/bot_templates", payload);
  return applicationProgram;
};

export const updateBotTemplate = async (id, payload) => {
  const applicationProgram = await api.patch(
    `/items/bot_templates/${id}`,
    payload
  );
  return applicationProgram;
};
