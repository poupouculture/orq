import { api } from "src/boot/axios";

export const getInternalGroups = async ({ limit = 10, page = 1 }) => {
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const internalGroups = await api.get("/items/user_groups", {
    params: {
      limit,
      offset,
      fields:
        "id, name, status, users.*.id, users.*.avatar, users.*.first_name, users.*.last_name, users.*.avatar, users.*.role.name",
      meta: "*",
    },
  });
  return internalGroups;
};

export const getInternalGroup = async (id: number | string) => {
  const internalGroups = await api.get("/items/user_groups/" + id, {
    params: {
      fields:
        "id, name, status, type, users.*.id, users.*.avatar, users.*.first_name, users.*.last_name, users.*.avatar, users.*.role.name. users.user_groups_id.*, customer_groups.*",
    },
  });
  return internalGroups;
};

export const addInternalGroup = async (payload: any) => {
  const internalGroup = await api.post("/items/user_groups", payload);
  return internalGroup;
};

export const updateInternalGroup = async (payload: any) => {
  const internalGroup = await api.patch(
    "/items/user_groups/" + payload.id,
    payload
  );
  return internalGroup;
};

export const deleteInternalGroup = async (id: number) => {
  const internalGroup = await api.delete("/items/user_groups/" + id);
  return internalGroup;
};

export const deleteUser = async (id: number) => {
  const userGroupsDirectusUsers = await api.delete(
    "/items/user_groups_directus_users/" + id
  );
  return userGroupsDirectusUsers;
};
