import { api } from "boot/axios";

export const getDocumentTemplates = async ({ limit = 10, page = 1 }) => {
  const fields = `*`;

  const offset = page === 1 ? 0 : (page - 1) * limit;

  const templates = await api.get(`/items/document_templates`, {
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

export const getDocumentTemplate = async (id) => {
  const fields = `*`;

  const documentTemplate = await api.get(
    `/items/document_templates/${id}?fields=${fields}`
  );
  return documentTemplate;
};

export const addDocumentTemplate = async (payload) => {
  const documentTemplate = await api.post("/items/document_templates", payload);
  return documentTemplate;
};

export const updateDocumentTemplate = async (id, payload) => {
  const documentTemplate = await api.patch(
    `/items/document_templates/${id}`,
    payload
  );
  return documentTemplate;
};
