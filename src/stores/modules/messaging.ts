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
    async fetchChatMessagesByChatId(chatId: string, refresh?: boolean = false) {
      // In the MessagingLayout, when onMounted the storageItem "chatMessage"
      // would be removed, because for get tracking the updated data
      let storageItem: Array<IMessage> | any =
        localStorage.getItem("chatMessages");
      let data: IMessage[] = [];
      storageItem = JSON.parse(storageItem) || [];
      const filteredItems: IMessage[] = storageItem
        ? storageItem.filter((message: IMessage) => message.chat_id === chatId)
        : [];
      // if has storage item and this chat has in storage
      // refresh for the call getChatMessagesByChatId again
      if (storageItem && filteredItems.length > 0 && !refresh) {
        data = filteredItems;
      } else {
        data = await getChatMessagesByChatId(chatId);
        // set storage items
        storageItem = [
          ...storageItem,
          // mapping the data
          ...data.map((item) => ({
            ...item,
            // chat_id for filtering the data when chat selected
            chat_id: chatId,
          })),
        ];
        localStorage.setItem("chatMessages", JSON.stringify(storageItem));
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
