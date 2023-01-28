import { api } from "boot/axios";
import { ChatKeywords, ChatTypes } from "../constants/ChatKeyword";
import { SendTextMessage, StartNewChat } from "src/types/MessagingTypes";

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

export const sendChatTextMessage = async (payload: SendTextMessage) => {
  const { chatId, messageProduct, to, type, messageBody } = payload;

  const { data } = await api.post(`/waba/handle-cs-waba-message`, {
    chat_id: chatId,
    keyword: ChatKeywords.SEND_TEXT_MESSAGE,
    waba_content: {
      messaging_product: messageProduct,
      recipien_type: "individual",
      to,
      type,
      text: {
        preview_url: false,
        body: messageBody,
      },
    },
  });

  return data;
};

export const getContact = async (contactId: string) => {
  const { data } = await api.get(`/items/contacts/${contactId}`);
  return data;
};

export const startNewChat = async (
  payload: StartNewChat,
  contactId: string
) => {
  const { name, status } = payload;
  const {
    data: { data },
  } = await api.post(`/items/chats`, {
    name,
    status,
  });

  await addChatsContacts(data.id, contactId);

  return data;
};

const addChatsContacts = async (chatId: string, contactId: string) => {
  const chatsContacts = await api.post("/items/chats_contacts", {
    chats_id: chatId,
    contacts_id: contactId,
  });
  return chatsContacts;
};
