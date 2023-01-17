import { api } from "boot/axios";

export const getApplicationPrograms = async ({ limit = 10, page = 1 }) => {
  const fields = `id, name, status, language, delivered, read, replied, created_by, created_on`;

  const offset = page === 1 ? 0 : (page - 1) * limit;

  const templates = await api.get(`/items/message_templates`, {
    params: {
      fields: `${fields}`,
      sort: `-date_created`,
      limit,
      offset,
      meta: "*",
    },
  });

  return templates;
};

export const getApplicationProgram = async (id) => {
  const fields = `*`;

  const applicationProgram = await api.get(
    `/items/message_templates/${id}?fields=${fields}`
  );
  return applicationProgram;
};

export const addApplicationProgram = async (payload) => {
  const applicationProgram = await api.post("/items/message_templates", payload);
  return applicationProgram;
};

export const updateApplicationProgram = async (id, payload) => {
  const applicationProgram = await api.patch(`/items/message_templates/${id}`, payload);
  return applicationProgram;
};
