import { IChat } from "src/types/MessagingTypes";

const trimWord = (word: string, maxLength: number = 15) => {
  if (word.length > maxLength) {
    return word.substring(0, maxLength) + "...";
  }
  return word;
};

export const getChatName = (chat: IChat) => {
  if (chat.customers_id) {
    return trimWord(`${chat.first_name} ${chat.last_name}`);
  } else return "Visitor";
};

export const uuid = (): string => {
  return "xxxxxxxx-4xxx-yxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export default trimWord;
