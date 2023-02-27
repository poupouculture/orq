import { ChatTypes } from "src/constants/ChatKeyword";
export const enum Direction {
  OUTGOING = "outgoing",
  INCOMING = "incoming",
}
export const enum MessageType {
  TEXT = "text",
  TEMPLATE = "template",
}
export const enum Product {
  WHATSAPP = "whatsapp",
}
export interface IChat {
  id: string;
  contacts_id: string;
  customers_id: string | null;
  first_name: string | null;
  last_name: string | null;
  last_message: string;
  members: string;
  name: string;
  status: ChatTypes;
  totalUnread?: number;
}
export interface IMessage {
  id: number;
  chat_id: string;
  status: string;
  date_created: string;
  date_updated?: string;
  type: string;
  content: string;
  channel?: string;
  direction?: Direction;
}

export interface CachedChatMessages {
  [key: string]: IMessage[];
}

export interface ChatSnapshotMessage {
  [key: string]: () => void;
}

export interface IState {
  chatsList: IChat[];
  selectedChatId: string;
  leftDrawerOpen: boolean;
  rightDrawerOpen: boolean;
  messageLoading: boolean;
  showCustomerInfoMobile: boolean;
  cachedChatMessages: CachedChatMessages;
  selectedTab: ChatTypes;
  contactNumber: null | string;
  chatSnapshotMessage: ChatSnapshotMessage;
}

export interface SendTextMessage {
  chatId: string;
  messageProduct: Product;
  to: string;
  type: MessageType;
  messageBody: string;
  isTemplate?: boolean;
  templateName?: string;
  language?: string;
  isIncludedComponent?: boolean;
}

export interface LastMessage {
  id: number;
  chat_id: string;
  status: ChatTypes;
  direction: Direction;
  content: string;
  type: string;
  totalUnread?: number;
}
