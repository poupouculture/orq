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
  chat_id: string;
  last_message_date: string;
  last_message_text: string;
  customer_name: string;
  direction: Direction;
}

export interface IState {
  chatMessages: Array<IMessage>;
  selectedChat: IChat;
  chats: Array<IChat>;
}
