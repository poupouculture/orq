import { api } from "boot/axios";
import { ChatKeywords, ChatTypes } from "../constants/ChatKeyword";
import {
  SendTextMessage,
  ChatPayload,
  ComponentParameter,
} from "src/types/MessagingTypes";

export const setBotConfig = async (status: boolean) => {
  const { data } = await api.get(`/chat/config/office/${parseInt(!status)}`);
  return data;
};

export const fetchBotConfig = async () => {
  const { data } = await api.get("/chat/config");
  return data;
};

export const getChats = async (limit = 15, pageNumber = 1) => {
  const { data } = await api.get(`/chat/list`, {
    params: {
      page_number: pageNumber,
      page_size: limit,
      type: "all",
      multi: true,
    },
  });

  const ongoingChats = data?.data.ongoing;
  const waitingChats = data?.data.waiting;
  const closedChats = data?.data.closed;
  return ongoingChats.concat(waitingChats, closedChats);
};

export const getChatsByType = async (
  type?: ChatTypes,
  pageNumber = 1,
  limit = 15,
  sort = "desc"
) => {
  const typeSend = type || "all";
  const { data } = await api.get(`/chat/list`, {
    params: {
      page_number: pageNumber,
      page_size: limit,
      sort,
      type: typeSend,
      multi: true,
    },
  });
  return data.data.length > 0 ? data.data : [];
};

export const getChatByID = async (id: string) => {
  const { data } = await api.get(`/chat/chats/${id}`);
  console.log(data.data);
  return data.data.length > 0 ? data.data[0] : null;
};

export const getContactByChatId = async (id: string) => {
  console.log("DELETE THIS USELESS FUNCTION: getContactByChatId....");
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

export const getMessagesById = async (id: string) => {
  const { data } = await api.get(`/chat/messages/specific`, {
    params: { message_id: id },
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
    isMeta,
    templateName,
    language,
    isIncludedComponent,
    countParams,
    headerType,
    headerMessage,
    messageId,
  } = payload;

  console.log("[messaging-api] message payload", payload);
  const currPayload: ChatPayload = {
    channel: payload.channel,
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
  let url = "/waba/handle-cs-waba-message";
  if (type === "text") {
    url = "/whatsapp/message/waba";
  }
  if (isTemplate) {
    // ChatKeywords.SEND_TEMPLATE_MESSAGE;
    url = "/whatsapp/waba-send-template";
    console.log("[messaging-api] Message is a template");
  }
  if (!isMeta) {
    url = "/whatsapp/message/waba";
    console.log("[messaging-api] Message is not meta");
  }

  if (isTemplate) {
    if (isIncludedComponent) {
      const components = [];
      const parameters: ComponentParameter[] = [];
      const mediaHeader = ["MEDIA", "VIDEO", "IMAGE", "DOCUMENT"];
      console.log("[messaging-api] header type: ", headerType);
      console.log("[messaging-api] header message: ", headerMessage);

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

      // if (headerMessage !== "") {
      //   components.push({
      //     type: "header",
      //     parameters: [{ type: "text", text: headerMessage }],
      //   });
      // }

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

  if (isTemplate && !isMeta) {
    console.log("[messaging-api] Message is a template but not meta");
    delete currPayload.waba_content.name;
    currPayload.waba_content.text = {
      preview_url: false,
      body: messageBody,
    };
  }

  currPayload.waba_content.context = { message_id: messageId };
  const data = await api.post(url, currPayload);

  return data.data || null;
};

// export const getContact = async (contactId: string) => {
//   const { data } = await api.get(`/items/contacts/${contactId}`);
//   return data;
// };

export const startNewChat = async (
  customerId: string,
  contactNumber?: string
) => {
  const { data } = await api.post(`/waba/create-chat`, {
    customer_id: customerId,
    contact_number: contactNumber,
  });

  return data;
};

export const updateChatStatus = async (id: string, userId: string) => {
  // ??? delete later. after api confirmed
  // const data = await api.post(`/waba/assign-chat-user`, {
  //   chat_id: id,
  //   user_id: userId,
  //   take_it: true,
  // });
  console.log(userId);
  const data = await api.post(`/chat/take`, {
    chat_id: id,
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
  const data = await api.post(`/whatsapp/waba-send-media/${chatId}`, payload, {
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
