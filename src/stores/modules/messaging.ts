import { defineStore } from "pinia";
import {
  getChats,
  getChatMessagesByChatId,
  sendChatTextMessage,
  getContact,
} from "../../api/messaging";
import { ChatTypes } from "../../constants/ChatKeyword";
import { IState, SendTextMessage, IMessage } from "../../types/MessagingTypes";

const useMessagingStore = defineStore("messaging", {
  state: () =>
    ({
      chats: [],
      selectedChatIndex: null,
      selectedTab: ChatTypes.PENDING,
      chatMessages: [],
      cacheMessages: [],
      contactNumber: null,
      customerName: null,
    } as unknown as IState),
  getters: {
    getChats: (state) => state.chats,
    getChatMessages: (state) => state.chatMessages,
    getSelectedChatIndex: (state) => state.selectedChatIndex,
    getContactNumber: (state) => state.contactNumber,
    getCustomerName: (state) => state.customerName,
    getSelectedTab: (state) => state.selectedTab,
    isContactNumberExist: (state) => !!state.contactNumber,
  },
  actions: {
    closeChat() {
      this.selectedChatIndex = -1;
      this.chatMessages = [];
      this.contactNumber = null;
      this.customerName = null;
    },
    setSelectedChatIndex(index: number) {
      this.selectedChatIndex = index;
    },
    setSelectedTab(type: ChatTypes) {
      this.selectedTab = type;
    },
    async fetchChats(type: ChatTypes) {
      const data = await getChats(type);
      this.chats = data;
    },
    async fetchChatMessagesByChatId(chatId: string, refresh: boolean = false) {
      const cacheMessages: Array<IMessage> = this.cacheMessages;
      let data: IMessage[] = [];
      // filtering data by chatID
      const filteredItems: IMessage[] = cacheMessages.length
        ? cacheMessages.filter(
            (message: IMessage) => message.chat_id === chatId
          )
        : [];
      // checking cache messages exists
      // refresh for the call getChatMessagesByChatId again
      if (cacheMessages && filteredItems.length > 0 && !refresh) {
        data = filteredItems;
      } else {
        data = await getChatMessagesByChatId(chatId);
        this.cacheMessages = [
          ...cacheMessages,
          ...data.map((item) => ({
            ...item,
            // chat_id for filtering the data when chat selected
            chat_id: chatId,
          })),
        ];
      }
      this.chatMessages = data;
    },
    async sendChatTextMessage(payload: SendTextMessage) {
      const data = await sendChatTextMessage(payload);
      return data;
    },
    async fetchContactNumber(contactId: string) {
      const { data } = await getContact(contactId);
      this.setContactNumber(data.number);
    },
    setCustomerName(name: string) {
      this.customerName = name;
    },
    setContactNumber(contactNumber: string) {
      this.contactNumber = contactNumber;
    },
  },
});

export default useMessagingStore;
