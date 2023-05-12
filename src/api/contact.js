import { api } from "boot/axios";

export const getContacts = async (payload) => {
  const fields = "*, customers.customers_id.*";
  const { limit, page, search = undefined } = payload;
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const params = {
    fields,
    sort: "-date_created",
    limit,
    offset,
    search,
    meta: "*",
  };
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
