import { api } from "boot/axios";
import { ChatKeywords, ChatTypes } from "../constants/ChatKeyword";

export const getChats = async (type: ChatTypes) => {
  const { data } = await api.post(`/waba/handle-cs-waba-message`, {
    keyword: ChatKeywords.GET_CHATS,
    type,
  });

  return data;
};

export const getChatMessagesByChatId = async (id: string) => {
  const { data } = await api.post(`/waba/handle-cs-waba-message`, {
    keyword: ChatKeywords.GET_MESSAGES_BY_CHAT_ID,
    chat_id: id,
  });
  return data;
};
