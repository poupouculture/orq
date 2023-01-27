import { api } from "src/boot/axios";
import { IUserTransform } from "src/types/TransformObjectType";
import { userCreate } from "src/utils/transform-object";

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

export const getUsersFilter = async ({ limit = 10, page = 1 }, id: string) => {
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const fields = `id, first_name, last_name, gender, date_created, position, role.name`;

  const customer = await api.get("/users", {
    params: {
      limit,
      offset,
      "filter[_and][0][$FOLLOW(user_groups_directus_users,directus_users_id)][_none][user_groups_id][_eq]":
        id,
      "filter[_or][0][role][name][_in]": "CS,CS-Manager",
      fields,
      meta: "*",
    },
  });
  return customer;
};

export const addUserToUserGroup = async (payload: IUserTransform) => {
  const customer = await api.patch("/items/user_groups/" + payload.id, {
    users: {
      create: userCreate(payload),
    },
  });
  return customer;
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

export const deleteUserFromInternalGroup = async ({
  id,
  userId,
}: {
  id: string;
  userId: string[];
}) => {
  const { data: result } = await api.get("/items/user_groups_directus_users", {
    params: {
      "filter[user_groups_id][_eq]": id,
      "filter[directus_users_id][_eq]": userId,
    },
  });
  return await api.patch("/items/user_groups/" + id, {
    users: {
      delete: [result.data[0].id],
    },
  });
};
