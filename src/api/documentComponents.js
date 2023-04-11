import { api } from "boot/axios";

export const getDocumentComponents = async ({
  limit = 10,
  page = 1,
  search = "",
}) => {
  const fields = `*`;

  const offset = page === 1 ? 0 : (page - 1) * limit;

  const templates = await api.get(`/items/document_master_components`, {
    params: {
      fields: `${fields}`,
      sort: `-date_created`,
      limit,
      offset,
      search,
      meta: "*",
    },
  });

  return templates;
};

export const getDocumentComponent = async (id) => {
  const fields = `*`;

  const documentComponent = await api.get(
    `/items/document_master_components/${id}?fields=${fields}`
  );
  return documentComponent;
};

export const addDocumentComponent = async (payload) => {
  const documentComponent = await api.post(
    "/items/document_master_components",
    payload
  );
  return documentComponent;
};

export const updateDocumentComponent = async (id, payload) => {
  const documentComponent = await api.patch(
    `/items/document_master_components/${id}`,
    payload
  );
  return documentComponent;
};
