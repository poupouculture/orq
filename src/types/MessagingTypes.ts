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
  status: string;
  type: string;
  content: string;
  channel: string;
  direction: Direction;
}

export interface IChat {
  id: string;
  status: string;
  name: string;
  last_message: string;
  contacts_id: string;
  customers_id: string;
  first_name: string;
  last_name: string;
  members: string;
}

export interface IState {
  chatMessages: Array<IMessage>;
  selectedChatIndex: number;
  selectedTab: ChatTypes;
  chats: Array<IChat>;
  contactNumber: null | string;
}

export interface SendTextMessage {
  chatId: string;
  messageProduct: Product;
  to: string;
  type: MessageType;
  messageBody: string;
}

export interface StartNewChat {
  name: string;
  status: ChatTypes;
  sort?: string | null;
  user_created?: string | null;
}
