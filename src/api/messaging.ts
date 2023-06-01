import { api } from "boot/axios";
import { ChatKeywords, ChatTypes } from "../constants/ChatKeyword";
import {
  SendTextMessage,
  ChatPayload,
  ComponentParameter,
} from "src/types/MessagingTypes";

export const getChats = async (type?: ChatTypes) => {
  const { data } = await api.get(`/waba/chats/list/${type || "all"}`);
  return data;
};

export const getChatByID = async (id: string) => {
  const { data } = await api.get(`/chat/chats/${id}`);
  console.log(data.data);
  return data.data.length > 0 ? data.data[0] : null;
};

export const getContactByChatId = async (id: string) => {
  const params = {
    limit: 1,
    page: 1,
    fields: "id, contacts.*",
    meta: "*",
  };

  const response = await api.get(`/items/chats/${id}`, {
    params,
  });

  const data = response.data.data;

  if (!data.contacts) return "";

  return data.contacts[0];
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
    headerType,
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
      const mediaHeader = ["MEDIA", "VIDEO", "IMAGE", "DOCUMENT"];
      console.log("header type: ", headerType);

      if (mediaHeader.includes(headerType)) {
        const headerParam = {
          type: headerType.toLowerCase(),
        };

        if (headerType === "VIDEO") {
          headerParam.video = {
            link: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          };
        }
        if (headerType === "DOCUMENT") {
          headerParam.document = {
            link: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          };
        }
        if (headerType === "IMAGE") {
          headerParam.image = {
            link: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          };
        }

        components.push({
          type: "header",
          parameters: [headerParam],
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

  const data = await api.post(`/waba/handle-cs-waba-message`, currPayload);

  return data.data || null;
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
    take_it: true,
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

export const chatbots = async () => {
  const { data } = await api.get(`/items/chatbots?filter[status]=published`);
  return data;
};

export const initiateBot = async (
  chatId: string,
  botId: string,
  intent: string
) => {
  const { data } = await api.post(
    `/dialogflow/initiate-bot/${chatId}/${botId}`,
    {
      intent,
    }
  );
  return data;
};

export const closeBot = async (chatId: string) => {
  const { data } = await api.get(`/dialogflow/close-bot/${chatId}`);
  return data;
};
