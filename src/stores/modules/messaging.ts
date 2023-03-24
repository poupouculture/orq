import { defineStore } from "pinia";
import {
  IState,
  IChat,
  Message,
  SendTextMessage,
  MessageStatus,
} from "src/types/MessagingTypes";
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
      rightDrawerOpen: false,
      showCustomerInfoMobile: false,
      selectedTab: ChatTypes.PENDING,
      chatSnapshotMessage: {},
      cachedChatMessages: {},
      contactNumber: null,
      replayMessage: {},
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

        if (index !== -1) {
          const [chat] = this.chatsList.splice(index, 1);
          this.chatsList.unshift(chat);
          const cachedMessage = this.cachedChatMessages[chatId]?.find(
            (item) => item.id === lastmessage.id
          );
          chat.last_message = lastmessage;
          if (cachedMessage) return;
          if (lastmessage.status === MessageStatus.RECEIVE) {
            if (this.selectedChatId !== chatId) {
              chat.totalUnread = chat.totalUnread ? chat.totalUnread + 1 : 1;
            } else {
              chat.totalUnread = 0;
            }
          }
          this.cachedChatMessages[chatId]?.push(lastmessage);
        }
      } catch (error) {
        console.log(error);
      }
    },
    setCustomerInfoMobile(value: boolean) {
      this.showCustomerInfoMobile = value;
    },
    setReplayMessage(message?: Message) {
      this.replayMessage = message;
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
      const chatsList = [...ongoing, ...waiting, ...closed];
      this.chatsList = chatsList.map((item) => {
        item.last_message = JSON.parse(item.last_message);
        return item;
      });
    },

    async fetchChatMessagesById(chatId: string, page?: number, limit?: number) {
      try {
        const { data } = await getChatMessagesByChatId(chatId, page, limit);
        this.cachedChatMessages[chatId] = this.cachedChatMessages[chatId] ?? [];
        const messages = data.messages.map((item: any) => ({
          id: item.id,
          content: item.content,
          status: item.status,
          type: item.type,
          direction: item.direction,
          date_created: item.date_created,
        }));
        this.cachedChatMessages[chatId] = [
          ...messages,
          ...this.cachedChatMessages[chatId],
        ];
        const hasmore =
          this.cachedChatMessages[chatId].length < data.total_count;
        return hasmore;
      } catch (e) {
        console.log(e);
      }
    },

    async sendChatTextMessage(payload: SendTextMessage) {
      const data = await sendChatTextMessage(payload);
      return data;
    },

    async onSelectChat(chatId: string) {
      this.selectedChatId = chatId;
      this.rightDrawerOpen = true;
    },

    async fetchContactNumber(contactId: string) {
      const { data } = await getContact(contactId);
      this.setContactNumber(data.number);
    },
  },
});
export default useMessagingStore;
