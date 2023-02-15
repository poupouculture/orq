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
  TEMPLATE = "template",
}

export interface IMessage {
  id?: number;
  chat_id: string;
  status: string;
  date_created?: string;
  type: string;
  content: string;
  channel?: string;
  direction?: Direction;
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

export interface ChatGroup {
  status: ChatTypes;
  chats: IChat[];
}

export interface IState {
  chatMessages: Array<IMessage>;
  cacheMessages: Array<IMessage>;
  selectedChatIndex: number;
  selectedTab: ChatTypes;
  selectedChat: IChat;
  chats: ChatGroup[];
  contactNumber: null | string;
  customerName: null | string;
  chatSnapshotGroup: any;
  showChatList: boolean;
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
  components: TemplateComponent[];
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
