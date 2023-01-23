export const enum ChatKeywords {
  REPLY = "reply-to-text-message",
  REPLY_WITH_REACTION = "reply-with-reaction-message",
  GET_CHATS = "load-user-chats",
  GET_MESSAGES_BY_CHAT_ID = "load-user-chat-messages",
}

export const enum ChatTypes {
  PENDING = "waiting",
  ONGOING = "ongoing",
  CLOSED = "closed",
}
