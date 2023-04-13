import { api } from "src/boot/axios";
import { IUserTransform } from "src/types/TransformObjectType";
import { userCreate } from "src/utils/transform-object";
import { getCustomerGroups } from "./customerGroup";

export const searchPersonalGroup = async (query: string) => {
  const data = await api.get("/items/user_groups", {
    params: {
      search: query,
      "filter[type][_eq]": "personal",
    },
  });
  return data;
};

export const getPersonalGroups = async (
  limit: number = 10,
  page: number = 1,
  search?: string,
  type?: string
) => {
  const offset = page === 1 ? 0 : (page - 1) * limit;
  const PersonalGroup = await api.get("/items/user_groups", {
    params: {
      limit,
      search,
      "filter[type][_eq]": type,
      offset,
      fields:
        "id,name,status,customer_groups.customer_groups_id.name,customer_groups.customer_groups_id.status,customer_groups.customer_groups_id.id",
      meta: "*",
    },
  });
  return PersonalGroup;
};

export const getCustomerGroup = async (
  rowsPerPage = 10,
  page = 1,
  search?: string
) => {
  // const customerGroup = await api.get(
  //   "/items/customer_groups?limit=-1&fields=id,name,status"
  // );

  const customerGroups = await getCustomerGroups({
    limit: rowsPerPage,
    page,
    search,
  });
  console.log(customerGroups);

  return customerGroups;
};

export const addRelationship = async (payload: any[]) => {
  const results = await api.post("/items/customer_groups_user_groups", payload);

  return results;
};

export const deleteRelationship = async (payload: []) => {
  const results = await api.delete(`/items/customer_groups_user_groups`, {
    data: payload,
  });
  return results;
};

export const getRelationship = async (id: string) => {
  const params = {
    fields: "*",
    "filter[user_groups_id][_eq]": id,
  };
  const { data } = await api.get(`/items/customer_groups_user_groups`, {
    params,
  });
  return data;
};

export const getPersonalGroup = async (id: string) => {
  const PersonalGroup = await api.get("/items/user_groups/" + id, {
    params: {
      fields:
        "id,name,status,customer_groups.customer_groups_id.name,customer_groups.customer_groups_id.status,customer_groups.customer_groups_id.id",
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
