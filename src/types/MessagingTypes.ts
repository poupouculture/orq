import { ChatTypes } from "src/constants/ChatKeyword";

export const enum Direction {
  OUTGOING = "outgoing",
  INCOMING = "incoming",
}

export const enum Product {
  WHATSAPP = "whatsapp",
}

export const enum MessageType {
  TEXT = "text",
}

export interface IMessage {
  id: number;
  chat_id: string;
  status: string;
  date_created: string;
  type: string;
  content: string;
  channel: string;
  direction: Direction;
}

export interface IChatMessageCacheItem extends IMessage {
  chatId: string;
}

export interface IChat {
  id: string;
  status: ChatTypes;
  name?: string;
  last_message?: string;
  contacts_id: string;
  customers_id: string;
  first_name: string;
  last_name: string;
  members?: string;
}

export interface IState {
  chatMessages: Array<IMessage>;
  cacheMessages: Array<IMessage>;
  selectedChatIndex: number;
  selectedTab: ChatTypes;
  chats: Array<IChat>;
  contactNumber: null | string;
  customerName: null | string;
}

export interface SendTextMessage {
  chatId: string;
  messageProduct: Product;
  to: string;
  type: MessageType;
  messageBody: string;
}
