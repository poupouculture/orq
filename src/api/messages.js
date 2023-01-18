import { api } from "boot/axios";

export const getUserChats = async ({ keyword, type }) => {
  const chats = await api.post("/waba/handle-cs-waba-message", {
    keyword,
    type,
  });

  return chats;
};
