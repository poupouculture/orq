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

// export const getChatNameEn = (chat: IChat) => {
//   if (chat.customers_id) {
//     return trimWord(`${chat.customer_company_name_en}`);
//   } else {
//     if (chat.contact_first_name) {
//       return trimWord(`${chat.contact_first_name}`);
//     } else {
//       return "Visitor";
//     }
//   }
// };

export const getChatNameEn = (chat: IChat) => {
  if (chat.customers_id) {
    return trimWord(`${chat.customer_company_name_en}`);
  } else {
    return getContactNameEn(chat);
  }
};

export const getContactNameEn = (chat: IChat) => {
  if (chat.contact_first_name) {
    return trimWord(`${chat.contact_first_name}`);
  } else {
    return "Visitor";
  }
};

export const uuid = (): string => {
  return "xxxxxxxx-4xxx-yxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const blobToBase64 = async (blob: Blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (e: any) {
      resolve(e.target?.result);
    };
    reader.readAsDataURL(blob);
  });
};

export default trimWord;
