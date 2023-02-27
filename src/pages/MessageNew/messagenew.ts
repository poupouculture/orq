import { defineStore } from "pinia";
import { IState, IChat, LastMessage } from "src/pages/MessageNew/Message";
import { SendTextMessage } from "src/types/MessagingTypes";
import { ChatTypes } from "src/constants/ChatKeyword";

import {
  getChats,
  getChatMessagesByChatId,
  sendChatTextMessage,
  getContact,
} from "src/api/messaging";
const useMessagingStore = defineStore("messaging", {
  state: () =>
    ({
      chatsList: [],
      selectedChatId: "",
      leftDrawerOpen: true,
      rightDrawerOpen: true,
      messageLoading: false,
      contactNumber: null,
      showCustomerInfoMobile: false,
      selectedTab: ChatTypes.PENDING,
      chatSnapshotMessage: {},
      cachedChatMessages: {},
    } as unknown as IState),
  getters: {
    getChatsList: (state) => state.chatsList,
    getSelectedChatId: (state) => state.selectedChatId,
    getChatSnapshotMessage: (state) => state.chatSnapshotMessage,
    getContactNumber: (state) => state.contactNumber,
    isContactNumberExist: (state) => !!state.contactNumber,
    getSelectedChat: (state) => {
      return state.chatsList.find(
        (chat) => chat.id === state.selectedChatId
      ) as IChat;
    },
  },
  actions: {
    setSelectedChatId(chatId: string) {
      this.selectedChatId = chatId;
    },
    setRightDrawerOpen(isOpen: boolean) {
      this.rightDrawerOpen = isOpen;
    },
    setLeftDrawerOpen(isOpen: boolean) {
      this.leftDrawerOpen = isOpen;
    },
    setSelectedTab(type: ChatTypes) {
      this.selectedTab = type;
    },
    setChatStatus(chatId: string, status: ChatTypes) {
      const chat = this.chatsList.find((chat) => chat.id === chatId);
      if (chat) {
        chat.status = status;
      }
    },
    setChatSnapshotMessage(chatId: string, cancleFn: () => void) {
      this.chatSnapshotMessage[chatId] = cancleFn;
    },
    setChatsLastMessage(chatId: string, lastmessage: LastMessage) {
      const index = this.chatsList.findIndex((chat) => chat.id === chatId);
      if (index !== -1) {
        const [chat] = this.chatsList.splice(index, 1);
        if (this.selectedChatId !== chatId) {
          chat.totalUnread = chat.totalUnread ? chat.totalUnread + 1 : 1;
        } else {
          chat.totalUnread = 0;
        }
        chat.last_message = JSON.stringify(lastmessage);
        this.chatsList.unshift(chat);
        this.cachedChatMessages[chatId]?.push(lastmessage);
      }
    },
    async fetchContactNumber(contactId: string) {
      const { data } = await getContact(contactId);
      this.setContactNumber(data.number);
    },
    setContactNumber(contactNumber: string) {
      this.contactNumber = contactNumber;
    },
    setCustomerInfoMobile(value: boolean) {
      this.showCustomerInfoMobile = value;
    },
    cleanTotalUnread() {
      const chat = this.chatsList.find(
        (chat) => chat.id === this.selectedChatId
      );
      if (chat) {
        chat.totalUnread = 0;
      }
    },
    updateChatsList(newchat: IChat, status?: ChatTypes) {
      if (status) {
        newchat.status = status;
      }
      this.chatsList = this.chatsList.filter(
        (chat: IChat) => chat.id !== newchat.id
      );
      this.chatsList.unshift(newchat);
      this.selectedTab = newchat.status;
    },
    async fetchChats() {
      const ongoingPromise = getChats(ChatTypes.ONGOING);
      const waitingPromise = getChats(ChatTypes.PENDING);
      const closedPromise = getChats(ChatTypes.CLOSED);
      const ongoing = await ongoingPromise;
      const waiting = await waitingPromise;
      const closed = await closedPromise;
      this.chatsList = [...ongoing, ...waiting, ...closed];
    },

    async fetchChatMessagesById(chatId: string) {
      try {
        this.messageLoading = true;
        const cachedChatMessage = this.cachedChatMessages[chatId];
        if (!cachedChatMessage) {
          const messages = await getChatMessagesByChatId(chatId);
          this.cachedChatMessages[chatId] = messages;
        }
        this.messageLoading = false;
      } catch (e) {
        this.messageLoading = false;
      }
    },

    async sendChatTextMessage(payload: SendTextMessage) {
      const data = await sendChatTextMessage(payload);
      return data;
    },

    async onSelectChat(chatId: string) {
      this.selectedChatId = chatId;
      this.rightDrawerOpen = true;
      if (!this.cachedChatMessages[chatId]) {
        this.fetchChatMessagesById(chatId);
      }
    },
  },
});
export default useMessagingStore;
