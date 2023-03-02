import { ChatTypes } from "src/constants/ChatKeyword";

export const enum Direction {
  OUTGOING = "outgoing",
  INCOMING = "incoming",
}
export const enum MessageType {
  TEXT = "text",
  TEMPLATE = "template",
  IMAGE = "image",
  AUDIO = "audio",
}

export const enum MessageStatus {
  RECEIVE = "received",
  SENT = "sent",
}

export const enum Product {
  WHATSAPP = "whatsapp",
}

export interface Member {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
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
  // showCustomerInfoMobile: boolean;
  cachedChatMessages: CachedChatMessages;
  selectedTab: ChatTypes;
  chatSnapshotMessage: ChatSnapshotMessage;
  contactNumber: string;
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
  status: MessageStatus;
  direction: Direction;
  content: string;
  type: string;
  totalUnread?: number;
  date_created: string;
  last_message_id?: number;
}

export interface IChatMessageCacheItem extends IMessage {
  chatId: string;
}

export interface ChatPayloadWabaContentText {
  preview_url: boolean;
  body: string;
}

export interface Language {
  code: string | undefined;
}

export interface ComponentParameter {
  type: string;
  text: string;
}

export interface TemplateComponent {
  type: string;
  parameters: ComponentParameter[];
}

export interface ChatPayloadWabaContentTemplate {
  name: string | undefined;
  language: Language;
  components?: TemplateComponent[];
}

export interface ChatPayloadWabaContent {
  messaging_product: string;
  recipient_type: string;
  to: string;
  type: string;
  text?: ChatPayloadWabaContentText;
  template?: ChatPayloadWabaContentTemplate;
}

export interface ChatPayload {
  chat_id: string;
  keyword: string;
  template_content?: string;
  waba_content: ChatPayloadWabaContent;
}

export interface Message {
  id: number;
  content: any;
  direction?: string;
  status: string;
  old_date_created: string | null;
  date_created: string;
}
