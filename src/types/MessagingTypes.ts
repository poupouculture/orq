import { ChatTypes } from "src/constants/ChatKeyword";

export const enum Direction {
  OUTGOING = "outgoing",
  INCOMING = "incoming",
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
}
