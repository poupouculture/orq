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
} from "../../types/MessagingTypes";
import { db, collection, onSnapshot } from "src/boot/firebase";

const useMessagingStore = defineStore("messaging", {
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
      this.chats = this.chats.map((chats) => {
        chats.chats.map((chat) => {
          if (chat.id === id) {
            const data = {
              ...JSON.parse(chat.last_message || "{}"),
              ...lastMessage,
            };
            chat.last_message = JSON.stringify(data);
          }
          return chat;
        });
        return chats;
      });
    },
    setSelectedChat(chat: IChat) {
      this.selectedChat = chat;
    },
    setSelectedChatByStatus(status: ChatTypes) {
      this.selectedChat.status = status;
    },
    setShowChatList(show: boolean) {
      this.showChatList = show;
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
    async setChatsByStatus(status: ChatTypes) {
      const chatGroupIndex = this.chats.findIndex(
        (group: ChatGroup) => group.status === status
      );
      if (chatGroupIndex >= 0) {
        const chats = await getChats(status);
        this.chats[chatGroupIndex].chats = chats;
      }
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
              if (this.getSelectedChat.id === chatId) {
                const { content, status, type } = change.doc.data();
                const dateCreated = new Date();
                const direction =
                  status === "sent" ? Direction.OUTGOING : Direction.INCOMING;
                this.addMessageToCache({
                  chatId,
                  dateCreated: dateCreated.toString(),
                  direction,
                  status,
                  content,
                  type,
                });
              } else {
                if (snapshoted) {
                  this.setChatsLastMessage(chatId, change.doc.data());
                }
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
