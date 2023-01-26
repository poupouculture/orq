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

export const addUser = async (payload: unknown) => {
  const customer = await api.post("/users", payload);
  return customer;
};

export const getManagerUsers = async () => {
  const managers = await api.post(`/waba/load-cs-manager-users`, {});
  return managers;
};

export const assignManager = async (chatId: string, userId: string) => {
  const result = await api.post(`/waba/assign-chat-user`, {
    chat_id: chatId,
    user_id: userId,
  });
  return result;
};
