import { defineStore } from "pinia";
import {
  IState,
  IChat,
  Message,
  SendTextMessage,
} from "src/types/MessagingTypes";
import { ChatTypes } from "src/constants/ChatKeyword";
import {
  getChats,
  getChatMessagesByChatId,
  sendChatTextMessage,
  getContact,
} from "src/api/messaging";
import { Loading } from "quasar";
const useMessagingStore = defineStore("messaging", {
  state: () =>
    ({
      chatsList: [],
      selectedChatId: "",
      leftDrawerOpen: true,
      rightDrawerOpen: true,
      showCustomerInfoMobile: false,
      selectedTab: ChatTypes.PENDING,
      chatSnapshotMessage: {},
      cachedChatMessages: {},
      contactNumber: null,
    } as unknown as IState),
  getters: {
    getChatsList: (state) => state.chatsList,
    getSelectedChatId: (state) => state.selectedChatId,
    getChatSnapshotMessage: (state) => state.chatSnapshotMessage,
    getContactNumber: (state) => state.contactNumber,
    getSelectedChat: (state) => {
      return state.chatsList.find(
        (chat: IChat) => chat.id === state.selectedChatId
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
      const chat = this.chatsList.find((chat: IChat) => chat.id === chatId);
      if (chat) {
        chat.status = status;
      }
    },
    setChatSnapshotMessage(chatId: string, cancleFn: () => void) {
      this.chatSnapshotMessage[chatId] = cancleFn;
    },
    setContactNumber(contactNumber: string) {
      this.contactNumber = contactNumber;
    },
    setMessageMembers(members: string) {
      this.getSelectedChat.members = members;
    },
    setChatsLastMessage(chatId: string, lastmessage: Message) {
      try {
        const index = this.chatsList.findIndex(
          (chat: IChat) => chat.id === chatId
        );
        const cachedMessage = this.cachedChatMessages[chatId].find(
          (item) => item.id === lastmessage.last_message_id
        );
        if (cachedMessage) return;
        if (index !== -1) {
          // const cachedMessage = this.cachedChatMessages[chatId];
          // if (cachedMessage?.length) {
          //   const [lastCachedMessage] = cachedMessage.slice(-1);
          //   if (
          //     lastmessage.last_message_id &&
          //     lastmessage.last_message_id <= lastCachedMessage.id
          //   ) {
          //     return;
          //   }
          // }
          const [chat] = this.chatsList.splice(index, 1);
          if (chat.last_message)
            if (this.selectedChatId !== chatId) {
              // only receivede message should plus totalUnread;
              chat.totalUnread = chat.totalUnread ? chat.totalUnread + 1 : 1;
            } else {
              chat.totalUnread = 0;
            }

          chat.last_message = JSON.stringify(lastmessage);
          this.chatsList.unshift(chat);
          this.cachedChatMessages[chatId]?.push(lastmessage);
        }
      } catch (error) {
        console.log(error);
      }
    },
    setCustomerInfoMobile(value: boolean) {
      this.showCustomerInfoMobile = value;
    },
    cleanTotalUnread() {
      const chat = this.chatsList.find(
        (chat: IChat) => chat.id === this.selectedChatId
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
        Loading.show();
        const cachedChatMessage = this.cachedChatMessages[chatId];
        if (!cachedChatMessage) {
          const messages = await getChatMessagesByChatId(chatId);
          this.cachedChatMessages[chatId] = messages.map((item: any) => ({
            id: item.id,
            content: item.content,
            status: item.status,
            type: item.type,
            direction: item.direction,
            date_created: item.date_created,
          }));
        }
        Loading.hide();
      } catch (e) {
        Loading.hide();
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

    async fetchContactNumber(contactId: string) {
      const { data } = await getContact(contactId);
      this.setContactNumber(data.number);
    },
  },
});
export default useMessagingStore;
