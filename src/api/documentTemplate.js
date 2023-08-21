import { api } from "boot/axios";

export const getDocumentTemplates = async ({
  type = "invoice",
  limit = 10,
  page = 1,
  search = "",
}) => {
  const fields = `*`;

  const offset = page === 1 ? 0 : (page - 1) * limit;

  const templates = await api.get(`/items/document_templates`, {
    params: {
      fields: `${fields}`,
      sort: `-date_created`,
      limit,
      offset,
      search,
      meta: "*",
      "filter[status][_neq]": "archived",
      "filter[type][_eq]": type,
    },
  });

  return templates;
};

export const getActivedDocument = async (type = "invoice") => {
  const templates = await api.get(`/items/document_templates`, {
    params: {
      fields: `id`,
      "filter[type][_eq]": type,
      "filter[status][_eq]": "active",
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

export const activateDocumentTemplate = async (id, type) => {
  // unactive the previous template
  await api.patch(`/items/document_templates`, {
    query: {
      filter: {
        type,
        status: "active",
      },
    },
    data: {
      status: "published",
    },
  });

  const documentTemplate = await updateDocumentTemplate(id, {
    status: "active",
  });

  return documentTemplate;
};

export const getComponentsByType = async (type) => {
  const params = {
    fields: `*`,
    sort: `-date_created`,
    meta: "*",
    "filter[type][_eq]": type,
  };

  const documentTemplate = await api.get(`/items/document_supported`, {
    params,
  });

  return documentTemplate;
};
