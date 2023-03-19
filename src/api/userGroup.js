import { api } from "src/boot/axios";

export const getUserGroups = async ({
  limit = 10,
  page = 1,
  filter,
  search,
}) => {
  const fields = `*,users.*`;
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const filterField =
    filter && filter.key ? { [filter.key]: filter.value } : undefined;
  try {
    const userGroups = await api.get("/items/user_groups", {
      params: {
        fields: `${fields}`,
        sort: `-date_created`,
        limit,
        search,
        ...filterField,
        offset,
        meta: "*",
      },
    });
    return userGroups;
  } catch (error) {}
};

export const getAllUserGroupEdit = async (payload) => {
  const { limit, page, userGroups, filter, search } = payload;
  const fields = `*,users.*`;
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const filterField =
    filter && filter.key ? { [filter.key]: filter.value } : undefined;
  return await api.get("/items/user_groups", {
    params: {
      "filter[id][_nin]": userGroups.join(),
      fields,
      ...filterField,
      sort: "-date_created",
      search,
      limit,
      offset,
      meta: "*",
    },
  });
};
