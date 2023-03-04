import { api } from "boot/axios";

export const getMessageTemplates = async ({
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

  const templates = await api.get(`/items/message_templates`, {
    params,
  });

  return templates;
};

export const getMessageTemplate = async (id) => {
  const fields = `*`;

  const applicationProgram = await api.get(
    `/items/message_templates/${id}?fields=${fields}`
  );
  return applicationProgram;
};

export const getMessageTemplateByName = async (name = "hello_world") => {
  const params = {
    fields: `*`,
    sort: `-date_created`,
    limit: 1,
    offset: 1,
    meta: "*",
  };

  params["filter[name][_eq]"] = name;

  const templates = await api.get(`/items/message_templates`, {
    params,
  });

  return templates;
};

export const addMessageTemplate = async (payload) => {
  const applicationProgram = await api.post(
    "/items/message_templates",
    payload
  );
  return applicationProgram;
};

export const updateMessageTemplate = async (id, payload) => {
  const applicationProgram = await api.patch(
    `/items/message_templates/${id}`,
    payload
  );
  return applicationProgram;
};
