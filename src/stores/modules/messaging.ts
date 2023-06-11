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
  getMessagesById,
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
          // chat.mode = lastmessage.mode;
          this.chatsList.unshift(chat);
          const cachedMessageIndex = this.cachedChatMessages[chatId]?.findIndex(
            (item) => item.id === lastmessage.id || item.is_cache
          );
          chat.last_message = lastmessage;
          console.log(cachedMessageIndex);
          // delete cache when cache is exists
          if (cachedMessageIndex !== -1 && cachedMessageIndex !== undefined) {
            this.cachedChatMessages[chatId].splice(cachedMessageIndex, 1);
          }
          if (lastmessage.status === MessageStatus.RECEIVE) {
            if (this.selectedChatId !== chatId) {
              chat.totalUnread = chat.totalUnread ? chat.totalUnread + 1 : 1;
            } else {
              chat.totalUnread = 0;
            }
          }

          lastmessage.waba_associated_message_id =
            lastmessage.associated_message_id;
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
      this.replayMessage = message || ({} as Message);
    },
    cleanTotalUnread() {
      const chat = this.chatsList.find(
        (chat: IChat) => chat.id === this.selectedChatId
      );
      if (chat) {
        chat.totalUnread = 0;
      }
    },
    updateChatTabSelected(status: ChatTypes) {
      this.selectedTab = status;
      // ???
      // if (status !== ChatTypes.CLOSED) {
      //   this.selectedTab = status;
      // }
    },
    updateChatsList(newchat: IChat, status?: ChatTypes) {
      console.log("updateChatsList-----");
      if (status) {
        newchat.status = status;
      }
      this.chatsList = this.chatsList.filter(
        (chat: IChat) => chat.id !== newchat.id
      );
      this.chatsList.unshift(newchat);
      // this.selectedTab = newchat.status;
      // if ((getSelectedChat.value.mode = newchat.id)) { // only when we are focussed on the current chat, then the selected status moves
      //   this.selectedTab = newchat.status;
      // }
    },
    async fetchChats() {
      const chatsList = await getChats();
      // ???todo no error handling
      this.chatsList = chatsList.map((item: any) => {
        item.last_message = JSON.parse(item.last_message);
        return item;
      });
    },

    async fetchChatMessagesById(chatId: string, page?: number, limit?: number) {
      try {
        const { data } = await getChatMessagesByChatId(chatId, page, limit);
        this.cachedChatMessages[chatId] = this.cachedChatMessages[chatId] ?? [];
        const showAssociatedMessage = true;
        let messages = null;
        if (showAssociatedMessage) {
          messages = await Promise.all(
            data.messages.map(async (item: any) => ({
              id: item.id,
              tracking_id: item.tracking_id,
              content: item.content,
              contact_name: item.contact_name,
              user_name: item.user_name,
              status: item.status,
              type: item.type,
              direction: item.direction,
              date_created: item.date_created,
              waba_message_id: item.waba_message_id,
              waba_associated_message_id: item.waba_associated_message_id,
              waba_associated_message: item.waba_associated_message_id
                ? await this.associatedMessageGet(
                    item.waba_associated_message_id
                  )
                : null,
              mode: item.mode,
              contact: item.contact,
              channel: item.channel,
              conversation_id: item.conversation_id,
            }))
          );
          console.log("messages:------", messages);
        } else {
          messages = data.messages.map((item: any) => ({
            id: item.id,
            tracking_id: item.tracking_id,
            content: item.content,
            contact_name: item.contact_name,
            user_name: item.user_name,
            status: item.status,
            type: item.type,
            direction: item.direction,
            date_created: item.date_created,
            waba_message_id: item.waba_message_id,
            waba_associated_message_id: item.waba_associated_message_id,
            mode: item.mode,
            contact: item.contact,
            channel: item.channel,
            conversation_id: item.conversation_id,
          }));
        }

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

    async associatedMessageGet(messageId: string) {
      const data = await getMessagesById(messageId);
      const cleaned = data.data[0];
      console.log("---associatedMessageGet:", cleaned);
      return cleaned;
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
    changeModeChatListById(id: string, mode: string) {
      console.log("changeModeChatListById-----");
      const index = this.chatsList.findIndex((chat) => chat.id === id);
      this.chatsList[index].mode = mode;
    },
    changeConversationType(id: string, conversationType: string) {
      console.log("changeConversationType-----");
      const index = this.chatsList.findIndex((chat) => chat.id === id);
      this.chatsList[index].conversation_type = conversationType;
    },
    changeExpiry(id: string, expirationTimestamp: number) {
      console.log("changeExpiry-----");
      const index = this.chatsList.findIndex((chat) => chat.id === id);
      this.chatsList[index].expiration_timestamp = expirationTimestamp;
    },
  },
});
export default useMessagingStore;
