import { api } from "boot/axios";

export const getContacts = async (payload) => {
  const fields = "*, customers.customers_id.*";
  const {
    limit,
    page,
    search = undefined,
    filterType = undefined,
    filter = undefined,
  } = payload;
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const params = {
    fields,
    sort: "-date_created",
    limit,
    offset,
    "filter[customers][_nnull]": true,
    "filter[number][_nnull]": true,
    meta: "*",
  };
  if (filter?.length) {
    filter.forEach((data) => {
      params[data.key] = data.value;
    });
  }
  if (!filterType) {
    params.search = search;
  }
  if (filterType === "customer_code") {
    params[
      "filter[_and][0][_and][0][customers][customers_id][customer_code][_contains]"
    ] = search;
  } else if (filterType === "location_code") {
    params[
      "filter[_and][0][_and][0][customers][customers_id][location_code][_contains]"
    ] = search;
  }
  const contact = await api.get("items/contacts", { params });
  return contact;
};
export const getContact = async (id) => {
  const fields = "*";
  const limit = -1;

  const contact = await api.get("items/contacts", {
    params: {
      fields,
      limit,
      "filter[id][_eq]": id,
    },
  });

  return contact;
};

export const updateContact = async (id, payload) => {
  const contact = await api.patch(`items/contacts/${id}`, payload);

  return contact;
};

export const dissociateContactApi = async (payload) => {
  const results = await api.post("/chat/contact/dissociate/delete", payload);

  return results;
};
export const dissociateContacts = async (payload) => {
  const results = await api.post(
    "/chat/contact/dissociate/delete_multiple",
    payload
  );

  return results;
};
