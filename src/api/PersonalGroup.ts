import { api } from "src/boot/axios";
import { IUserTransform } from "src/types/TransformObjectType";
import { userCreate } from "src/utils/transform-object";

export const searchPersonalGroup = async (query: string) => {
  const data = await api.get("/items/user_groups", {
    params: {
      search: query,
      "filter[type][_eq]": "personal",
    },
  });
  return data;
};

export const getPersonalGroups = async ({
  limit = 10,
  page = 1,
  search = undefined,
}) => {
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const PersonalGroup = await api.get("/items/user_groups", {
    params: {
      limit,
      search,
      "filter[type][_eq]": "personal",
      offset,
      fields:
        "id, customer_groups.*, customer_groups.*.* ,name,type, status, users.*.id, users.*.avatar, users.*.first_name, users.*.last_name, users.*.avatar, users.*.role.name",
      meta: "*",
    },
  });
  console.log(PersonalGroup.data);

  return PersonalGroup;
};

export const getPersonalGroup = async (id: string) => {
  const users =
    "users.*.id, users.*.avatar, users.*.first_name, users.*.last_name, users.*.avatar, users.*.role.name. users.user_groups_id.*";
  const customerGroups = "customer_groups.*, customer_groups.*.*";
  const tags = "tags.*, tags.*.*";
  const PersonalGroup = await api.get("/items/user_groups/" + id, {
    params: {
      fields: `id,name,status,type,${customerGroups},${users},${tags}`,
    },
  });
  return PersonalGroup;
};

export const getUsersFilter = async (
  { limit = 10, page = 1, search = undefined },
  ids: string[]
) => {
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const fields = `id, first_name, last_name, gender, date_created, position, role.name`;

  const customer = await api.get("/users", {
    params: {
      limit,
      offset,
      search,
      "filter[_and][0][id][_nin]": ids.join(),
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

export const addPersonalGroup = async (payload: any) => {
  const personalGroup = await api.post("/items/user_groups", payload);
  return personalGroup;
};

export const updatePersonalGroup = async (payload: any) => {
  const personalGroup = await api.patch(
    "/items/user_groups/" + payload.id,
    payload
  );
  return personalGroup;
};

export const deletePersonalGroup = async (id: number) => {
  const personalGroup = await api.delete("/items/user_groups/" + id);
  return personalGroup;
};

export const deleteUserFromPersonalGroup = async ({
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
