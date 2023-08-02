import { defineStore } from "pinia";
import useCustomerStore from "src/stores/modules/customer";
import useContactStore from "src/stores/modules/contact";
import useUserInfoStore from "src/stores/modules/userInfo";

import {
  IState,
  IChat,
  Message,
  SendTextMessage,
  MessageStatus,
} from "src/types/MessagingTypes";
import { ChatTypes } from "src/constants/ChatKeyword";
import { getContact } from "src/api/contact";
import {
  getChats,
  getChatMessagesByChatId,
  sendChatTextMessage,
  // getContact,
  getChatsByType,
  getMessagesById,
  chatbots,
  setOfficeHours,
  configGet,
} from "src/api/messaging";

import { ref } from "vue";
import { io } from "socket.io-client";
import { getChatUsers } from "src/api/user";
const socket = ref();
const socketUrl = process.env.SOCKETS_URL as string;

const customerStore = useCustomerStore();
const { getContactByChat } = useContactStore();
const contactStore = useContactStore();
const userInfoStore = useUserInfoStore();

const useMessagingStore = defineStore("messaging", {
  state: () =>
    ({
      chatsList: [],
      users: [],
      selectedChatId: "",
      selectedChatPending: false,
      selectedChatExpired: false,
      leftDrawerOpen: true,
      rightDrawerOpen: false,
      showCustomerInfoMobile: false,
      selectedTab: ChatTypes.PENDING,
      chatSnapshotMessage: {},
      cachedChatMessages: {},
      contactNumber: null,
      replayMessage: {},
      socket,
      botList: [],
      isOfficeHours: false,
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
    getUserBySelectedChat(state) {
      const chat = state.chatsList.find(
        (chat: IChat) => chat.id === state.selectedChatId
      ) as IChat;
      return chat
        ? state.users.find((user) => chat.admin === user.user_id)
        : {};
    },
    // getUserByUserId(state) {
    //   return state.users.find(
    //     (user) => user.user_id === userInfoStore.getUserProfile?.id
    //   );
    // },
    getSelectedChatPending: (state) => state.selectedChatPending,
    getSelectedChatExpired: (state) => state.selectedChatExpired,
  },
  actions: {
    async getWabaUsers() {
      try {
        const response = await getChatUsers();
        this.users = response.data;
      } catch (error) {}
    },
    async officeHours_set(value: boolean) {
      try {
        const results = await setOfficeHours(value);
        console.log("[messaging] Set office hours", results);
        this.officeHours_get_set();
      } catch (error) {
        console.error("[messaging] Error setting office hour", error);
        this.isOfficeHours = !value;
      }
    },
    async officeHours_get_set() {
      try {
        const results = await configGet();
        console.log("[messaging] Office hours", results);
        this.isOfficeHours = results.ENABLE_PROFILE_BOT === "1";
      } catch (error) {
        console.log("[messaging] Error fetching office hour", error);
      }
    },
    setSelectedChatPending(value: boolean) {
      this.selectedChatPending = value;
    },
    setSelectedChatExpired(value: boolean) {
      this.selectedChatExpired = value;
    },
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
    setConversationType(chat: IChat, conversationType: string) {
      // console.log("fnc-setConversationType");
      chat.conversation_type = conversationType;
    },
    /**
     * parse last message and determines the conversation_type
     * @param msg
     * @returns
     */
    parseLastMessageError(msg: Message) {
      // console.log("parseError");
      // console.log(msg);
      const errObj: any = {};
      if (msg?.status === MessageStatus.FAILURE) {
        console.log("fnc-parseLastMessageError");
        errObj.status = true;
        if (msg.content?.error_body?.errors) {
          console.log(msg.content?.error_body?.errors[0]);
          errObj.conversation_type = this.errorCode(
            msg.content?.error_body?.errors[0]
          );
        }
        console.log(errObj);
      }

      return errObj;
    },
    errorCode(errObj: any) {
      switch (errObj.code) {
        case 131047:
          console.log("ERR:", ChatTypes.PENDING_INBOUND);
          return ChatTypes.PENDING_INBOUND;
        case 132000:
          //
          // return "132000";
          break;
        case 131053:
          //
          // return "131053";
          break;
        case 131026:
          // Message Undeliverable.
          // not a valid number
          break;
        default:
          return "";
        // if (errObj.code === 131047) {
        //   return ChatTypes.PENDING_INBOUND;
        // }
      }
      return "";
    },
    setChatsLastMessage(chatId: string, lastmessage: Message) {
      try {
        console.log("fnc-setChatsLastMessage:---");
        const index = this.chatsList.findIndex(
          (chat: IChat) => chat.id === chatId
        );
        if (index !== -1) {
          const [chat] = this.chatsList.splice(index, 1);
          // chat.mode = lastmessage.mode;
          // this.chatsList.unshift(chat);
          if (chat?.status === ChatTypes.PENDING) {
            this.chatsList.push(chat);
          } else {
            this.chatsList.unshift(chat);
          }
          this.sortChatsList();
          const cachedMessageIndex = this.cachedChatMessages[chatId]?.findIndex(
            (item) => item.id === lastmessage.id || item.is_cache
          );
          const errObj = this.parseLastMessageError(lastmessage);
          if (errObj.status) {
            console.log("ERRORRRRR");
            if (errObj.conversation_type) {
              console.log("ERRORRRRR:type");
              console.log(errObj.type);
              chat.conversation_type = errObj.type;
            }
          }
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
          lastmessage.waba_associated_message =
            lastmessage.last_associated_message_content;
          lastmessage.waba_associated_message_id =
            lastmessage.associated_message_id;
          this.cachedChatMessages[chatId]?.push(lastmessage);
        }
      } catch (error) {
        console.log(error);
      }
    },
    sortChatsList() {
      this.chatsList = this.chatsList.sort((a: any, b: any) => {
        if (
          a.admin === userInfoStore.getUserProfile?.id &&
          b.admin !== userInfoStore.getUserProfile?.id
        )
          return -1;
        if (
          b.admin === userInfoStore.getUserProfile?.id &&
          a.admin !== userInfoStore.getUserProfile?.id
        )
          return 1;
        return 1;
      });
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
    /**
     * adds chat into the cached. this prevents duplicate chats
     * @param newchat
     * @param status
     */
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
        item.admin_data = this.users.find(
          (user) => user.user_id === item.admin
        );
        // item.id = item.id.toString(); // ??? 0707
        return item;
      });
      this.sortChatsList();
    },
    async socketConnect(userInfo: any) {
      console.log(socketUrl);
      socket.value = io(socketUrl, {
        reconnectionDelayMax: 30000,
        extraHeaders: {
          authorization: `${userInfo.value.access_token}`,
        },
        // transports: ["websocket"],
      });
    },
    async socketEventsInit() {
      console.log("Listening EVENTS:", socketUrl);
    },
    async loadMoreChats(
      type?: ChatTypes,
      pageNumber?: number,
      limit?: number,
      order?: string
    ) {
      const chats = await getChatsByType(type, pageNumber, limit, order);

      chats.forEach((loadedChat: IChat) => {
        console.log("loaded chat:", loadedChat);

        const checker = this.chatsList.find(
          (chat) => chat.id === loadedChat.id
        );

        console.log("is listed:", checker);

        if (!checker) {
          if (loadedChat.last_message) {
            loadedChat.last_message = JSON.parse(
              loadedChat.last_message.toString()
            );
          } else {
            loadedChat.last_message = {
              id: 0,
              content: {
                type: "text",
                text: "",
              },
              direction: "incoming",
              is_cache: true,
              contact_company_name: "",
              contact_customer_name: "",
              status: MessageStatus.RECEIVE,
              date_created: "",
              user_created: "",
              employee: "",
            };
          }
          this.chatsList.push(loadedChat);
        }
      });

      return chats;
    },

    async fetchChatMessagesById(chatId: string, page?: number, limit?: number) {
      try {
        const { data } = await getChatMessagesByChatId(chatId, page, limit);
        this.cachedChatMessages[chatId] = this.cachedChatMessages[chatId] ?? [];
        const showAssociatedMessage = false;
        let messages = null;
        // console.log("fetchChatMessagesById");
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
              user_created: item.user_created,
              employee: item.employee,
              waba_message_id: item.waba_message_id,
              waba_associated_message_id: item.waba_associated_message_id,
              waba_associated_message: item.waba_associated_message_id
                ? await this.associatedMessageGet(
                    item.waba_associated_message_id
                  )
                : null,
              last_associated_message_content:
                item.last_associated_message_content,
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
            user_created: item.user_created,
            employee: item.employee,
            waba_message_id: item.waba_message_id,
            waba_associated_message_id: item.waba_associated_message_id,
            last_associated_message_content: item.waba_associated_message_id
              ? item.last_associated_message_content
              : null,
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
          this.cachedChatMessages[chatId].length < data.total_count &&
          messages.length >= (limit ?? 15);
        return hasmore;
      } catch (e) {
        console.log(e);
      }
    },

    async associatedMessageGet(messageId: string) {
      const data = await getMessagesById(messageId);
      const cleaned = data?.data[0];
      console.log("---associatedMessageGet:", cleaned);
      return cleaned;
    },

    async sendChatTextMessage(payload: SendTextMessage) {
      const data = await sendChatTextMessage(payload);
      return data;
    },

    /**
     * sets the screen to display the current chat
     * @param chatId
     */
    async onSelectChat(chatId: string) {
      this.selectedChatId = chatId;
      this.rightDrawerOpen = true;
    },
    async clearChatCustomer() {
      const targetChat = this.getSelectedChat;
      targetChat.customer_company_name_en = "Visitor";
      targetChat.customers_id = null;
    },
    async assignChatCustomer(customerId: string, customer?: any) {
      const targetChat = this.getSelectedChat;
      // targetChat.customer_company_name_en = "Visitor";
      targetChat.customers_id = customerId;
      if (customer) {
        targetChat.customer_company_name_en =
          customer?.customer_company_name_en;
      }
      // targetChat.contact_first_name = contact.first_name;
      // targetChat.contact_last_name = contact.last_name;
    },
    async setChatCustomerContact(chat: IChat) {
      // console.log("SELECT CHAT");
      console.log("fnc-setChatCustomerContact", chat);
      if (!chat.contacts_id) {
        console.log(" fnc: selectChat- no contact_id");
        const contact = await getContactByChat(chat);
        chat.contacts_id = contact.id;
      }
      // const contact = await messagingStore.fetchContactNumber(chat.contacts_id); // redundant call.
      customerStore.$reset();
      contactStore.$reset();
      let contact = null;
      if (chat.customers_id) {
        const customer = await customerStore.fetchCustomer(chat.customers_id); // console.log("fnc-getCurrentCustomerId:...", getCurrentCustomerId.value);
        contactStore.setCurrentCustomerId(customer.id);
        // if (customer?.contacts.length === 1) {
        //   // a customer can be related to MANY contacts
        //   contact = customer?.contacts[0].contacts_id;
        //   contactStore.setCurrentCustomerId(chat.customers_id);
        //   useContactStore().setContact(contact);
        // }
        // else {
        //   contact = await getContactById(chat);
        //   useContactStore().setContact(contact);
        // }
      } else {
        customerStore.setCustomer(null);
      }
      if (!contact) {
        // the invariant is that there is always a contact
        contact = await getContactByChat(chat);
        if (contact) {
          contactStore.setContact(contact);
          console.log("  GET contact:....", contact);
          // this.setContactNumber(contact?.number);
        }
      }
    },

    async fetchContactNumber(contactId: string) {
      const { data } = await getContact(contactId);
      // console.log(data);
      const contact = data?.data[0];
      this.setContactNumber(contact.number);
      return contact;
    },
    changeModeChatListById(id: string, mode: string) {
      const index = this.chatsList.findIndex((chat) => chat.id === id);
      this.chatsList[index].mode = mode;
    },
    changeAdminChatListById(id: string, admin: string) {
      const index = this.chatsList.findIndex((chat) => chat.id === id);
      this.chatsList[index].admin = admin;
      this.chatsList[index].admin_data = this.users.find(
        (user) => user.user_id === admin
      ) as any;
      this.sortChatsList();
    },
    changeConversationType(id: string, conversationType: string) {
      console.log("  changeConversationType----fnc");
      const index = this.chatsList.findIndex((chat) => chat.id === id);
      this.chatsList[index].conversation_type = conversationType;
    },
    changeExpiry(id: string, expirationTimestamp: number) {
      console.log("  changeExpiry-----fnc");
      const index = this.chatsList.findIndex((chat) => chat.id === id);
      this.chatsList[index].expiration_timestamp = expirationTimestamp;
    },
    async setBotList() {
      console.log("setBotList");
      const canAccessBot = userInfoStore.getPageActionsByPageId(
        "F10",
        "BotAction"
      );

      if (canAccessBot && this.botList.length < 1) {
        const { data } = await chatbots();
        console.log("data botlist:", data);
        this.botList = data;
      }
    },
  },
});
export default useMessagingStore;
