import { api } from "src/boot/axios";

export const getUserGroups = async ({ limit = 10, page = 1 }) => {
  const fields = `id, name, status, users.*`;
  const offset = page === 1 ? 0 : (page - 1) * limit;
  try {
    const userGroups = await api.get("/items/user_groups", {
      params: {
        fields: `${fields}`,
        sort: `-date_created`,
        limit,
        offset,
        meta: "*",
      },
    });
    return userGroups;
  } catch (error) {}
};

export const getAllUserGroupEdit = async (payload) => {
  const { limit, page, userGroups } = payload;
  const fields = `id, name, status, users.*`;
  const offset = page === 1 ? 0 : (page - 1) * limit;
  return await api.get("/items/user_groups", {
    params: {
      "filter[id][_nin]": userGroups.join(),
      fields,
      sort: "-date_created",
      limit,
      offset,
      meta: "*",
    },
  });
};
