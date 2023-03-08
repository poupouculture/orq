import { api } from "boot/axios";
import { ChatKeywords, ChatTypes } from "../constants/ChatKeyword";
import {
  SendTextMessage,
  ChatPayload,
  Language,
} from "src/types/MessagingTypes";

export const getChats = async (type: ChatTypes) => {
  const { data } = await api.get(`/waba/chats/list/${type}`);

  return data;
};

export const getChatMessagesByChatId = async (
  id: string,
  page = 1,
  limit = 15
) => {
  const { data } = await api.get(`/waba/chats/messages/${id}`, {
    params: { page, limit },
  });
  return data;
};

// export const loadChatMessages = async (payload: any) => {
//   const defaultParams = {
//     page_size: 50,
//     direction: "forward",
//     // backwards forward
//   };
//   const { data } = await api.post(`/waba/load-chat-messages-page`, {
//     ...defaultParams,
//     ...payload,
//   });
//   return data;
// };

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
    isIncludedComponent,
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
    const lang: Language = {
      code: language === "English" ? "en_US" : language,
    };

    if (isIncludedComponent) {
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
      // It was outside of the conditional
      currPayload.template_content = messageBody;

      currPayload.waba_content.template = {
        name: templateName,
        language: lang,
        text: messageBody,
      };
    }
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

export const startNewChat = async (customerId: string) => {
  const { data } = await api.post(`/waba/create-chat`, {
    customer_id: customerId,
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

export const uploadMedia = async (chatId: string, payload: any) => {
  const { data } = await api.post(`/waba/media-message/${chatId}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
