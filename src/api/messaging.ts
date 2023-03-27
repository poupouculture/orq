import { api } from "boot/axios";
import { ChatKeywords, ChatTypes } from "../constants/ChatKeyword";
import {
  SendTextMessage,
  ChatPayload,
  ComponentParameter,
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
    params: { page, limit, sort: "-id", chunk_sort: "asc" },
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
    countParams,
    isUploadComponent,
    messageId,
  } = payload;

  const currPayload: ChatPayload = {
    chat_id: chatId,
    keyword: isTemplate
      ? ChatKeywords.SEND_TEMPLATE_MESSAGE
      : ChatKeywords.SEND_TEXT_MESSAGE,
    waba_content: {
      to,
      type,
      context: {},
    },
  };

  if (isTemplate) {
    if (isIncludedComponent) {
      const components = [];
      const parameters: ComponentParameter[] = [];
      if (isUploadComponent) {
        components.push({
          type: "header",
          parameters: [
            {
              type: "video",
              video: {
                link: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
              },
            },
          ],
        });

        countParams?.forEach((paramBody, index) => {
          parameters.push({
            type: "text",
            text:
              index === 0
                ? messageBody.replaceAll("\n", "")
                : paramBody.replaceAll("\n", ""),
          });
        });
      } else {
        parameters.push({
          type: "text",
          text: messageBody.replaceAll("\n", ""),
        });
      }

      components.push({
        type: "body",
        parameters,
      });

      console.log("params body salim", parameters);
      currPayload.waba_content = {
        to,
        type,
        name: templateName,
        languageCode: language === "English" ? "en_US" : language,
        components,
      };
    } else {
      // It was outside of the conditional
      currPayload.template_content = messageBody;

      currPayload.waba_content = {
        to,
        type,
        name: templateName,
        languageCode: language === "English" ? "en_US" : language,
        // text: messageBody,
      };
    }
  } else {
    currPayload.waba_content.messaging_product = messageProduct;
    currPayload.waba_content.recipient_type = "individual";
    currPayload.waba_content.text = {
      preview_url: false,
      body: messageBody,
    };
  }

  currPayload.waba_content.context = { message_id: messageId };

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
  const data = await api.post(`/waba/media-message/${chatId}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
