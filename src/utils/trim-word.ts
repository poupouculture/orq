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

export default trimWord;
