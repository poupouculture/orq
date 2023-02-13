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
} from "../../types/MessagingTypes";
import { db, collection, onSnapshot } from "src/boot/firebase";

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
      chatSnapshotGroup: {},
    } as unknown as IState),
  getters: {
    getChats: (state) => state.chats,
    getSelectedChat: (state) => {
      const selectedChats = state.chats.find(
        (chat) => chat.status === state.selectedTab
      );
      return selectedChats?.chats[state.selectedChatIndex];
    },
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
    setChatsLastMessage(id: string, lastMessage: any) {
      this.chats = this.chats.map((chats) => {
        chats.chats.map((chat) => {
          if (chat.id === id) {
            console.log(55555, lastMessage);

            chat.last_message = JSON.stringify(lastMessage);
          }
          return chat;
        });
        return chats;
      });
      console.log(777777, this.chats);
    },
    setChatSnapshotGroup(id: string, cancleFn: unknown) {
      this.chatSnapshotGroup[id] = cancleFn;
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
      this.chatMessages.push(payload);
      this.cacheMessages.push(payload);
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
    onSnapshotMessage(chatId: string) {
      if (!this.chatSnapshotGroup[chatId]) {
        const snpshotCancel = onSnapshot(
          collection(db, "messages", chatId, "members"),
          async (querySnapshot: any) => {
            console.log("监听到消息");

            for await (const change of querySnapshot.docChanges()) {
              console.log(123213);

              // 获取当前的id与现有id比较
              const chats = this.chats.find(
                (chat) => chat.status === this.selectedTab
              );
              const selectedChat: any = chats?.chats[this.selectedChatIndex];
              console.log(selectedChat && selectedChat.id === chatId);
              if (selectedChat && selectedChat.id === chatId) {
                console.log("good 渲染数据");
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
                // 左侧chats更新
                this.setChatsLastMessage(chatId, change.doc.data());
              }
              console.log(11111, change.doc.id, change.doc.data());
            }
          }
        );
        this.setChatSnapshotGroup(chatId, snpshotCancel);
      }
    },
  },
});

export default useMessagingStore;
