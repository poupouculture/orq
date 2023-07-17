import { api } from "boot/axios";

export const getMessageTemplates = async ({
  limit = 10,
  page = 1,
  status = "*",
  search = "",
  isApproved = true,
  isMeta,
}) => {
  // const fields = `*, directus_users.*`;
  const fields = `*`;

  const offset = page === 1 ? 0 : (page - 1) * limit;

  const params = {
    fields: `${fields}`,
    sort: `-date_created`,
    limit,
    offset,
    meta: "*",
  };

  console.log("[message-template-api] getMessageTemplates params", {
    limit,
    page,
    status,
    search,
    isApproved,
    isMeta,
  });

  if (search !== "") params.search = search;

  if (status !== "*") params["filter[status][_eq]"] = status;
  if (status === "*") params["filter[status][_neq]"] = "archived";
  if (isApproved) params["filter[is_approved][_eq]"] = true;
  if (isMeta != null) params["filter[is_meta][_eq]"] = isMeta;

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

export const checkDuplicationTemplate = async (name) => {
  const response = await api.post(`chat/message_templates/waba`, { name });
  return response;
};

export const checkDuplicateWaba = async (name) => {
  const params = {
    fields: `name, language`,
    sort: `-date_created`,
  };

  params["filter[name][_eq]"] = name;

  const templates = await api.get(`/items/message_templates`, {
    params,
  });

  return templates;
};
