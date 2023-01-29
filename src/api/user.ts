import { api } from "src/boot/axios";

export const getUsers = async ({ limit = 10, page = 1 }) => {
  const fields = `id, first_name, last_name, gender, date_created, position, role.name`;

  const offset = page === 1 ? 0 : (page - 1) * limit;
  try {
    const users = await api.get("/users", {
      params: {
        fields: `${fields}`,
        limit,
        offset,
        meta: "*",
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
  const companies = "companies.companies_id.*";
  const contacts = "contacts.contacts_id.*";

  const customer = await api.get(
    `/users/${id}?fields=${fields},${companies},${contacts}`
  );
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
  const managers = await api.post(`/waba/load-cs-manager-users`, {});
  return managers;
};

/**
 * if user is already in chat, then ignore
 * if user is not in chat, then add user to chat
 * @param chatId
 * @param userId
 * @returns
 */
export const assignUser = async (chatId: string, userId: string) => {
  const result = await api.post(`/waba/assign-chat-user`, {
    chat_id: chatId,
    user_id: userId,
  });
  return result;
};
