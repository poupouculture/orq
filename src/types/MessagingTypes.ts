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
  MEDIA = "media",
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

export enum SendMessageStatus {
  DEFAULT,
  PENDING = "pending",
  FAILURE = "failure",
  SUCCESS = "success",
}

export interface Message {
  id: number;
  content: any;
  direction?: string;
  status: MessageStatus;
  old_date_created?: string | null;
  date_created: string;
  type?: MessageType;
  sendMessageStatus?: SendMessageStatus;
  totalUnread?: number;
  label?: string;
  isEmoticon?: boolean;
  waba_message_id?: string;
  waba_associated_message_id?: string;
}
export interface IChat {
  id: string;
  contacts_id: string;
  customers_id: string | null;
  first_name: string | null;
  last_name: string | null;
  last_message: Message;
  members: string;
  name: string;
  status: ChatTypes;
  totalUnread?: number;
  expiration_timestamp: number;
  customer_company_name_en: string | null;
}

export interface CachedChatMessages {
  [key: string]: Message[];
}

export interface ChatSnapshotMessage {
  [key: string]: () => void;
}

export interface IState {
  chatsList: IChat[];
  selectedChatId: string;
  leftDrawerOpen: boolean;
  rightDrawerOpen: boolean;
  showCustomerInfoMobile: boolean;
  cachedChatMessages: CachedChatMessages;
  selectedTab: ChatTypes;
  chatSnapshotMessage: ChatSnapshotMessage;
  contactNumber: string;
  replayMessage: Message | undefined;
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
  countParams?: any[];
  headerType: string;
  messageId?: string;
}

export interface ChatPayloadWabaContentText {
  preview_url: boolean;
  body: string;
}

export interface Language {
  code: string | undefined;
}

export interface ComponentParameterLink {
  link: string;
}

export interface ComponentParameter {
  type: string;
  text?: string;
  video?: ComponentParameterLink;
  image?: ComponentParameterLink;
  document?: ComponentParameterLink;
}

export interface TemplateComponent {
  type: string;
  parameters: ComponentParameter[];
}

export interface ChatPayloadWabaContentTemplate {
  name: string | undefined;
  language: Language;
  components?: TemplateComponent[];
  text: string;
}

export interface ChatPayloadWabaContent {
  messaging_product?: string;
  recipient_type?: string;
  to: string;
  type: string;
  text?: ChatPayloadWabaContentText;
  name?: string | undefined;
  languageCode?: string;
  components?: TemplateComponent[];
  context?: any;
}

export interface ChatPayload {
  chat_id: string;
  keyword: string;
  template_content?: string;
  waba_content: ChatPayloadWabaContent;
}
