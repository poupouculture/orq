import { defineStore } from "pinia";
import {
  getChats,
  getChatMessagesByChatId,
  sendChatTextMessage,
  getContact,
} from "../../api/messaging";
import { ChatTypes } from "../../constants/ChatKeyword";
import { IState, SendTextMessage } from "../../types/MessagingTypes";

const useMessagingStore = defineStore("messaging", {
  state: () =>
    ({
      chats: [],
      selectedChatIndex: 0,
      selectedTab: ChatTypes.PENDING,
      chatMessages: [],
      contactNumber: null,
    } as unknown as IState),
  getters: {
    getChats: (state) => state.chats,
    getChatMessages: (state) => state.chatMessages,
    getSelectedChatIndex: (state) => state.selectedChatIndex,
    getContactNumber: (state) => state.contactNumber,
    getSelectedTab: (state) => state.selectedTab,
  },
  actions: {
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
    async fetchChatMessagesByChatId(chatId: string) {
      const data = await getChatMessagesByChatId(chatId);
      this.chatMessages = data;
    },
    async sendChatTextMessage(payload: SendTextMessage) {
      const data = await sendChatTextMessage(payload);
      return data;
    },
    async fetchContactNumber(contactId: string) {
      const { data } = await getContact(contactId);
      this.contactNumber = data.number;
    },
  },
});

export default useMessagingStore;
