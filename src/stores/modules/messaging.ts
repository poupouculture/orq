import { defineStore } from "pinia";
import { getChats, getChatMessagesByChatId } from "../../api/messaging";
import { ChatTypes } from "../../constants/ChatKeyword";
import { IState } from "../../types/MessagingTypes";

const useMessagingStore = defineStore("messaging", {
  state: () =>
    ({
      chats: [],
      selectedChatIndex: 0,
      chatMessages: [],
    } as unknown as IState),
  getters: {
    getChats: (state) => state.chats,
    getChatMessages: (state) => state.chatMessages,
    getSelectedChatIndex: (state) => state.selectedChatIndex,
  },
  actions: {
    setSelectedChatIndex(index: number) {
      this.selectedChatIndex = index;
    },
    async fetchChats(type: ChatTypes) {
      const data = await getChats(type);
      this.chats = data;
    },
    async fetchChatMessagesByChatId(chatId: string) {
      const data = await getChatMessagesByChatId(chatId);
      this.chatMessages = data;
    },
  },
});

export default useMessagingStore;
