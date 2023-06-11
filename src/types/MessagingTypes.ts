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
  VIDEO = "video",
  MEDIA = "media",
  DOCUMENT = "document",
  APPLICATION = "application",
  REACTION = "reaction",
}

export const enum MessageStatus {
  RECEIVE = "received",
  SENT = "sent",
  FAILURE = "failure",
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
  is_cache?: true;
  contact_name?: string;
  user_name?: string;
  contact?: string;
  content: any;
  contact_company_name?: string;
  contact_customer_name?: string;
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
  waba_associated_message?: any;
  associated_message_id?: string;
  chat_id?: string;
  mode?: string;
  channel?: string;
}
export interface IChat {
  id: string;
  chat_id: string;
  contacts_id: string;
  customers_id: string | null;
  contact_first_name: string;
  contact_last_name: string;
  last_message: Message;
  members: string;
  name: string;
  status: ChatTypes;
  expiration_timestamp: number;
  customer_company_name_en: string | null;
  mode?: string;
  conversation_type?: string;
  totalUnread?: number;
  caption?: string;
  first_name?: string | null; // customer's first_name
  last_name?: string | null; // customer's last_name
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
  type: string; // this is REQUIRED for now.
  text?: ChatPayloadWabaContentText;
  name?: string | undefined;
  languageCode?: string;
  components?: TemplateComponent[];
  context?: any;
  to?: string; // 'to' value is determined by backend using chat_id
}

export interface ChatPayload {
  chat_id: string;
  keyword: string;
  template_content?: string;
  waba_content: ChatPayloadWabaContent;
}
export interface SocketMessage {
  document: Message;
}

export interface SocketEvent {
  document: any;
  update_fields: any;
}

export interface SendMessageResult {
  status: boolean;
  messageId: string;
  phoneNumber: string;
  whatsappId: string;
}

export interface SendMessageErrorResult {
  status: boolean;
  message: string;
  type: string;
  code: number;
}

export type FinalSendMessageResult = SendMessageResult | SendMessageErrorResult;

export interface Bot {
  name: string;
  trigger_intent: string;
  id: string;
}
