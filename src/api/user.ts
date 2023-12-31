import { api } from "src/boot/axios";

export const getUsers = async ({
  limit = 10,
  page = 1,
  search = undefined,
  ids = [],
}) => {
  const fields = `id,email,first_name,last_name,gender,date_created,position,role.name`;

  const offset = page === 1 ? 0 : (page - 1) * limit;
  try {
    const params = {
      fields: `${fields}`,
      limit,
      offset,
      meta: "*",
      search,
      "filter[_or][0][role][name][_in]": "CS,CS-Manager",
    } as any;
    if (ids?.length) {
      params["filter[_and][0][id][_nin]"] = ids.join();
    }
    const users = await api.get("/users", { params });
    return users;
  } catch (error) {}
};

export const getUser = async (id: string) => {
  const fields = "*";
  // const companies = "companies.companies_id.*";
  // const contacts = "contacts.contacts_id.*";

  const customer = await api.get(`/users/${id}?fields=${fields}`);
  return customer;
};

// uncomment this when we have the user management function
// export const addUser = async (payload: unknown) => {
//   const user = await api.post("/users", payload);
//   return user;
// };

/**
 * if user is a manager, then load all users with roles: cs and cs-manager
 * if user is a cs, then load all users with roles: cs
 * @returns
 */
export const getChatUsers = async (id?: number | string) => {
  let response;
  if (id) {
    response = await api.get(`/chat/details/${id}`);
  } else {
    response = await api.post(`/waba/load-waba-users`, {});
  }
  return response;
};

/**
 * if user is already in chat, then ignore
 * if user is not in chat, then add user to chat
 * @param chatId
 * @param userId
 * @returns
 */
export const assignUser = async (
  chatId: string,
  userId: string,
  addMember: boolean
) => {
  const params = {
    chat_id: chatId,
    user_id: userId,
    add_member: addMember,
  };
  const { data } = await api.post(`/waba/assign-chat-user`, params);
  return data;
};
