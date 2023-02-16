import { api } from "boot/axios";
import { ChatKeywords, ChatTypes } from "../constants/ChatKeyword";
import {
  SendTextMessage,
  ChatPayload,
  Language,
} from "src/types/MessagingTypes";

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
  const {
    chatId,
    messageProduct,
    to,
    type,
    messageBody,
    isTemplate,
    templateName,
    language,
  } = payload;

  const currPayload: ChatPayload = {
    chat_id: chatId,
    keyword: isTemplate
      ? ChatKeywords.SEND_TEMPLATE_MESSAGE
      : ChatKeywords.SEND_TEXT_MESSAGE,
    waba_content: {
      messaging_product: messageProduct,
      recipient_type: "individual",
      to,
      type,
    },
  };

  if (isTemplate) {
    currPayload.template_content = messageBody;
    const lang: Language = {
      code: language,
    };
    currPayload.waba_content.template = {
      name: templateName,
      language: lang,
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: messageBody,
            },
          ],
        },
      ],
    };
  } else {
    currPayload.waba_content.text = {
      preview_url: false,
      body: messageBody,
    };
  }

  const { data } = await api.post(`/waba/handle-cs-waba-message`, currPayload);

  return data;
};

export const getContact = async (contactId: string) => {
  const { data } = await api.get(`/items/contacts/${contactId}`);
  return data;
};

export const startNewChat = async (customerId: string, textMessage: string) => {
  const {
    data: { data },
  } = await api.post(`/waba/create-chat`, {
    customer_id: customerId,
    text_message: textMessage,
  });

  return data;
};

export const updateChatStatus = async (id: string, userId: string) => {
  const {
    data: { data },
  } = await api.post(`/waba/assign-chat-user`, {
    chat_id: id,
    user_id: userId,
  });

  return data;
};

export const closeChat = async (id: string) => {
  const {
    data: { data },
  } = await api.post(`/waba/close-chat`, {
    chat_id: id,
  });

  return data;
};
