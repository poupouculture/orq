import { api } from "boot/axios";

export const getTags = async () => {
  const result = await api.get(`items/tags`, {
    params: {
      "filter[status][_neq]": "draft",
    },
  });
  return result;
};
