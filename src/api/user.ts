import { api } from "src/boot/axios";

export const getUsers = async ({
  limit = 10,
  page = 1,
  search = undefined,
}) => {
  const fields = `id,email,first_name,last_name,gender,date_created,position,role.name`;

  const offset = page === 1 ? 0 : (page - 1) * limit;
  try {
    const users = await api.get("/users", {
      params: {
        fields: `${fields}`,
        limit,
        offset,
        meta: "*",
        search,
        filter: {
          _or: [
            { role: { name: { _eq: "CS-Manager" } } },
            { role: { name: { _eq: "CS" } } },
          ],
        },
      },
    });
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
export const getChatUsers = async () => {
  const users = await api.post(`/waba/load-waba-users`, {});
  return users;
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
