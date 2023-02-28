import { defineStore } from "pinia";
import {
  getChats,
  getChatMessagesByChatId,
  sendChatTextMessage,
  getContact,
} from "../../api/messaging";
import { ChatTypes } from "../../constants/ChatKeyword";
import {
  IState,
  SendTextMessage,
  IMessage,
  Direction,
  ChatGroup,
  IChat,
  CachedChatMessages,
} from "../../types/MessagingTypes";
import { db, collection, onSnapshot } from "src/boot/firebase";

const useMessagingStore = defineStore("OldMessaging", {
  state: () =>
    ({
      chats: [],
      selectedChatIndex: null,
      selectedTab: ChatTypes.PENDING,
      selectedChat: {},
      chatMessages: [],
      cacheMessages: [],
      contactNumber: null,
      customerName: null,
      chatSnapshotGroup: {},
      showCustomerInfoMobile: false,
      showChatList: true,
      cachedChatMessages: [],
    } as unknown as IState),
  getters: {
    getChats: (state) => state.chats,
    getChatMessages: (state) => state.chatMessages,
    getSelectedChatIndex: (state) => state.selectedChatIndex,
    getSelectedChat: (state) => state.selectedChat,
    getContactNumber: (state) => state.contactNumber,
    getCustomerName: (state) => state.customerName,
    getSelectedTab: (state) => state.selectedTab,
    isContactNumberExist: (state) => !!state.contactNumber,
    getShowChatList: (state) => state.showChatList,
    getCachedChatMessages: (state) => state.cachedChatMessages,
  },
  actions: {
    closeChat() {
      this.selectedChatIndex = -1;
      this.chatMessages = [];
      this.selectedChat = {} as IChat;
      this.contactNumber = null;
      this.customerName = null;
      this.showChatList = true;
    },
    setSelectedChatIndex(index: number) {
      this.selectedChatIndex = index;
    },
    setSelectedTab(type: ChatTypes) {
      this.selectedTab = type;
    },
    setChatSnapshotGroup(id: string, cancleFn: unknown) {
      this.chatSnapshotGroup[id] = cancleFn;
    },
    setChatsLastMessage(id: string, lastMessage: any) {
      let temp: any;
      this.chats.forEach((chats) => {
        chats.chats.forEach((item, index) => {
          if (item.id === id) {
            temp = item;
            // selectedChat should not show totalUnread
            if (this.selectedChat.id !== id) {
              temp.totalUnread = temp.totalUnread ? temp.totalUnread + 1 : 1;
            }
            const data = {
              ...JSON.parse(temp.last_message || "{}"),
              ...lastMessage,
            };
            temp.last_message = JSON.stringify(data);
            chats.chats.splice(index, 1);
            chats?.chats.unshift(temp);
          }
        });
      });
    },
    setSelectedChat(chat: IChat) {
      chat.totalUnread = 0; // reset totalUnread
      this.selectedChat = chat;
    },
    setSelectedChatByStatus(status: ChatTypes) {
      this.selectedChat.status = status;
    },
    setShowChatList(show: boolean) {
      this.showChatList = show;
    },
    setCachedChatMessagesById(id: string, messages: IMessage[]) {
      const cachedChatMessage = this.cachedChatMessages.find(
        (item: CachedChatMessages) => item.id === id
      );
      if (cachedChatMessage) {
        cachedChatMessage.messages = messages;
      }
    },
    updateMessages(chatId: string, upload: any) {
      const cachedChatMessage = this.cachedChatMessages.find(
        (item: CachedChatMessages) => item.id === chatId
      );
      if (cachedChatMessage) {
        // waiting for backend to fix
        cachedChatMessage.messages.push({
          ...cachedChatMessage.messages[0],
          ...upload,
        });
      }
    },
    async fetchChats() {
      const ongoingPromise = getChats(ChatTypes.ONGOING);
      const waitingPromise = getChats(ChatTypes.PENDING);
      const closedPromise = getChats(ChatTypes.CLOSED);

      const [ongoing, waiting, closed] = await Promise.all([
        ongoingPromise,
        waitingPromise,
        closedPromise,
      ]);

      this.chats = [
        { status: ChatTypes.ONGOING, chats: ongoing },
        { status: ChatTypes.PENDING, chats: waiting },
        { status: ChatTypes.CLOSED, chats: closed },
      ];
    },
    async fetchChatsByStatus(status: ChatTypes) {
      const chats = await getChats(status);
      return chats;
    },
    async fetchChatMessagesById(chatId: string) {
      const cachedChatMessage = this.cachedChatMessages.find(
        (item: CachedChatMessages) => item.id === chatId
      );
      if (cachedChatMessage) {
        // cachedChatMessage.messages = messages;
      } else {
        const messages = await getChatMessagesByChatId(chatId);
        this.cachedChatMessages.push({ id: chatId, messages });
      }
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
        data = data.map((item) => ({ ...item, chat_id: chatId }));
        // this.cacheMessages = this.cacheMessages.filter(
        //   (message: IMessage) => message.chat_id !== chatId
        // );
        // this.cacheMessages = [
        //   ...cacheMessages,
        //   ...data.map((item) => ({
        //     ...item,
        //     // chat_id for filtering the data when chat selected
        //     chat_id: chatId,
        //   })),
        // ];
      }
      this.chatMessages = data;
    },
    addMessageToCache({
      chatId = "",
      status = "",
      type = "text",
      content = "",
      direction = Direction.INCOMING,
      dateCreated = "",
    }: Pick<IMessage, "status" | "type" | "content" | "direction"> & {
      chatId: IMessage["chat_id"];
      dateCreated: IMessage["date_created"];
    }) {
      if (chatId) {
        return;
      }
      const payload = {
        chat_id: chatId,
        status,
        type,
        content,
        direction,
        date_created: dateCreated,
      };

      const message = this.cacheMessages.find(
        (item: IMessage) => item.content === content
      );
      if (!message) {
        this.chatMessages.push(payload);
        this.cacheMessages.push(payload);
      }
    },
    async setChatsByStatus(status: string, chatId: string) {
      let temp: any;
      this.chats.forEach((chats) => {
        chats.chats.forEach((item, index) => {
          if (item.id === chatId) {
            temp = item;
            chats.chats.splice(index, 1);
          }
        });
      });
      const chats = this.chats.find((chats) => chats.status === status);
      chats?.chats.unshift(temp);
    },
    // async setChatsByStatus(status: ChatTypes) {
    //   const chatGroupIndex = this.chats.findIndex(
    //     (group: ChatGroup) => group.status === status
    //   );
    //   if (chatGroupIndex >= 0) {
    //     const chats = await getChats(status);
    //     this.chats[chatGroupIndex].chats = chats;
    //   }
    // },
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
    setCustomerInfoMobile(value: boolean) {
      this.showCustomerInfoMobile = value;
    },
    onSnapshotMessage(chatId: string) {
      let snapshoted = false;
      if (!this.chatSnapshotGroup[chatId]) {
        const snpshotCancel = onSnapshot(
          collection(db, "messages", chatId, "members"),
          async (querySnapshot: any) => {
            for await (const change of querySnapshot.docChanges()) {
              if (snapshoted) {
                const {
                  content,
                  status,
                  type,
                  last_message_id: id,
                } = change.doc.data();
                // const dateCreated = new Date();
                const direction =
                  status === "sent" ? Direction.OUTGOING : Direction.INCOMING;
                const paylod = {
                  id,
                  chat_id: chatId,
                  status,
                  direction,
                  content,
                  type,
                };
                this.setChatsLastMessage(chatId, paylod);
                this.updateMessages(chatId, paylod);
              }
            }
            snapshoted = true;
          }
        );
        this.setChatSnapshotGroup(chatId, snpshotCancel);
      }
    },
    removeChatById(chatId: string) {
      this.chats = this.chats.map((chats: ChatGroup) => {
        chats.chats = chats.chats.filter((item) => item.id !== chatId);
        return chats;
      });
    },
  },
});

export default useMessagingStore;
