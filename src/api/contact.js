import { api } from "boot/axios";

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
