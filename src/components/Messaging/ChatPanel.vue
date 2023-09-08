<template>
  <q-list
    class="chat-panel bg-[#f2f3f7] pb-14 h-screen flex flex-col overflow-x-hidden"
  >
    <!-- search part -->
    <q-item-label header>
      <router-link
        to="/dashboard"
        class="logo-holder mb-3 flex items-center gap-3"
      >
        <img class="w-10" src="~assets/images/logo.svg" />
        <p class="font-[800] text-[#231815] text-2xl">ChaQ</p>
      </router-link>

      <div
        v-if="errSocket"
        class="logo-holder mb-3 flex row items-center gap-3"
      >
        <div class="font-[600] text-[#231815] text-h5 col-9">
          Refresh Your Page to Connect to Chats
        </div>
        <q-btn
          @click="refreshPage"
          color="primary"
          round
          icon="refresh"
          size="md"
        />
      </div>
      <q-input
        v-model="searchText"
        placeholder="Search Chats on screen..."
        outlined
        dense
        clearable
        clear-icon="close"
        @focus="isSearchFocused = true"
        @blur="isSearchFocused = false"
      >
        <template v-slot:prepend>
          <q-icon
            v-if="!isSearchFocused && searchText.length === 0"
            name="search"
          />
          <q-btn
            v-else
            flat
            round
            icon="arrow_back"
            size="s"
            padding="none"
            @click="
              () => {
                searchText = '';
                isSearchFocused = false;
              }
            "
          />
        </template>
        <template v-slot:after>
          <q-btn class="mr-1" padding="none" flat rounded icon="filter_list" />
          <q-btn
            unelevated
            color="primary"
            :icon="chatToggleLabel.state.icon"
            @click="fetchContacts"
          >
          </q-btn>
        </template>
      </q-input>
    </q-item-label>
    <!-- list part -->
    <q-tabs
      v-model="selectedTab"
      dense
      class="text-grey q-mt-md"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
      no-caps
    >
      <q-tab
        v-for="tab in Tabs"
        :key="tab.name"
        :name="tab.name"
        :icon="tab.icon"
        :label="tab.label + ` ${tabsTip[tab.name]?.num || 0}`"
      >
        <q-badge
          v-show="tabsTip[tab.name]?.totalUnread"
          :color="tab.badgeColor"
          align="top"
          floating
        >
          {{ tabsTip[tab.name]?.totalUnread }}
        </q-badge>
      </q-tab>
    </q-tabs>
    <q-separator class="mt-2" size="2px" inset />
    <!-- chatlist part -->
    <q-tab-panels
      class="h-full bg-[#f2f3f7]"
      v-model="selectedTab"
      animated
      swipeable
    >
      <q-tab-panel
        class="overflow-x-hidden"
        v-for="tab in Tabs"
        :key="tab.name"
        :name="tab.name"
        ref="chatListScroller"
      >
        <ChatList :type="tab.name" :filter-text="searchText" />
      </q-tab-panel>
    </q-tab-panels>
    <q-btn
      class="bg-primary text-white m-4 shadow-md"
      v-if="isShowingButtonLoadMore[selectedTab]"
      @click="showMoreChats"
      >Load More</q-btn
    >
    <ChatListFooter />
  </q-list>
  <!-- customer dialog -->
  <CustomerDialog
    v-model="showCustomerDialog"
    @hide="showCustomerDialog = false"
    @submit="chooseCustomer"
  />
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  onMounted,
  computed,
  onBeforeUnmount,
  watch,
  inject,
} from "vue";
import { storeToRefs } from "pinia";
import Swal from "sweetalert2";
import { io } from "socket.io-client";
import { ChatTypes } from "src/constants/ChatKeyword";
import useMessagingStore from "src/stores/modules/messaging";
import ChatList from "./ChatList.vue";
import ChatListFooter from "./ChatListFooter.vue";
import CustomerDialog from "./CustomerDialog.vue";
import {
  IChat,
  SocketChat,
  SocketChatUpdated,
  // SocketEvent,
  SocketMessage,
} from "src/types/MessagingTypes";
import {
  closeBot,
  startNewChat,
  // getContactByChatId,
  getChatByID,
} from "src/api/messaging";
import useUserInfoStore from "src/stores/modules/userInfo";
import useCustomerStore from "src/stores/modules/customer";
import useContactStore from "src/stores/modules/contact";
import { getContact } from "src/api/contact";
// import { searchCustomers, getCustomer } from "src/api/customers";
import { searchCustomers } from "src/api/customers";
import { Notify } from "quasar";
const rightDrawerOpen: any = inject("rightDrawerOpen");

const isSearchFocused = ref(false);

const ChatToggleLabel = {
  SHOW: {
    label: "Create new chat",
    icon: "add",
  },
  HIDE: {
    label: "Cancel",
    icon: "close",
  },
} as const;

const Tabs = reactive([
  {
    name: ChatTypes.ONGOING,
    icon: "cached",
    label: "Ongoing",
    badgeColor: "primary",
  },
  {
    name: ChatTypes.PENDING,
    icon: "schedule",
    label: "Waiting",
    badgeColor: "warning",
  },
  {
    name: ChatTypes.CLOSED,
    icon: "cancel",
    label: "Closed",
    badgeColor: "red",
  },
]);
type ChatToggleType = {
  // eslint-disable-next-line prettier/prettier
  state: (typeof ChatToggleLabel)[keyof typeof ChatToggleLabel];
};

const chatListScroller = ref(null);
const errSocket = ref(false);

const searchText = ref("");
watch(searchText, () => {
  if (searchText.value == null) {
    searchText.value = "";
  }
});

const userInfoStore = useUserInfoStore();
const { userInfo, userProfile } = storeToRefs(userInfoStore);
const chatToggleLabel: ChatToggleType = reactive({
  state: ChatToggleLabel.SHOW,
});
const messagingStore = useMessagingStore();
const contactStore = useContactStore();

const { chatsList, selectedTab, getSelectedChatId, getSelectedChat, allUsers } =
  storeToRefs(messagingStore);
const showCustomerDialog = ref(false);
const customerStore = useCustomerStore();
const socket = ref();

const pageNumber = ref({
  waiting: 1,
  ongoing: 1,
  closed: 1,
  all: 1,
});
const isShowingButtonLoadMore = ref({
  waiting: true,
  ongoing: true,
  closed: true,
  all: true,
});
const isChatsDecreased = ref({
  waiting: false,
  ongoing: false,
  closed: false,
  all: false,
});

const tabsTip = computed(() => {
  const result: any = {};
  chatsList.value.forEach((chat: IChat) => {
    if (result[chat.status]) {
      result[chat.status].num += 1;
      result[chat.status].totalUnread += chat.totalUnread || 0;
    } else {
      result[chat.status] = { num: 1, totalUnread: chat.totalUnread || 0 };
    }
  });
  return result;
});

const refreshPage = () => {
  window.location.reload();
};

// watch(chatsList, (list) => {
//   list.map((chat) => ({
//   }));
// });

watch(getSelectedChatId, () => {
  messagingStore.cleanTotalUnread();
});

watch(tabsTip, (newVal, oldVal) => {
  if (oldVal) {
    isChatsDecreased.value[ChatTypes.PENDING] = isChatsDecreased.value[
      ChatTypes.PENDING
    ]
      ? true
      : (oldVal[ChatTypes.PENDING]?.num ?? 0) >
        (newVal[ChatTypes.PENDING]?.num ?? 0);
    isChatsDecreased.value[ChatTypes.ONGOING] = isChatsDecreased.value[
      ChatTypes.ONGOING
    ]
      ? true
      : (oldVal[ChatTypes.ONGOING]?.num ?? 0) >
        (newVal[ChatTypes.ONGOING]?.num ?? 0);
    isChatsDecreased.value[ChatTypes.CLOSED] = isChatsDecreased.value[
      ChatTypes.CLOSED
    ]
      ? true
      : (oldVal[ChatTypes.CLOSED]?.num ?? 0) >
        (newVal[ChatTypes.CLOSED]?.num ?? 0);

    // console.log(
    //   "pending decreased?",
    //   oldVal[ChatTypes.PENDING]?.num,
    //   newVal[ChatTypes.PENDING]?.num,
    //   oldVal[ChatTypes.PENDING]?.num > newVal[ChatTypes.PENDING]?.num
    // );
    // console.log(
    //   "ongoing decreased?",
    //   oldVal[ChatTypes.ONGOING]?.num,
    //   newVal[ChatTypes.ONGOING]?.num,
    //   oldVal[ChatTypes.ONGOING]?.num > newVal[ChatTypes.ONGOING]?.num
    // );
    // console.log(
    //   "closed decreased?",
    //   oldVal[ChatTypes.CLOSED]?.num,
    //   newVal[ChatTypes.CLOSED]?.num,
    //   oldVal[ChatTypes.CLOSED]?.num > newVal[ChatTypes.CLOSED]?.num
    // );
  } else {
    isChatsDecreased.value[ChatTypes.PENDING] = false;
    isChatsDecreased.value[ChatTypes.ONGOING] = false;
    isChatsDecreased.value[ChatTypes.CLOSED] = false;
  }
});

const fetchContacts = async () => {
  showCustomerDialog.value =
    chatToggleLabel.state.icon === ChatToggleLabel.SHOW.icon;
};

const chooseCustomer = async (customer: any) => {
  customerStore.$reset();
  const [data] = await startNewChat(customer.id, customer.contact_number);
  // const response = await getCustomer(customer.id);
  // const customerObj = response.data.data;
  customerStore.setCustomer(customer);

  // data.customer_company_name_en = customerObj.customer_company_name_en;
  // data.last_message = JSON.parse(data.last_message);

  const chat = await getChatByID(data.id);
  if (chat) {
    const chatlist = chatsList.value.find((list) => list.id === chat.id);
    if (chatlist) {
      chat.admin = chatlist.admin;
      chat.admin_data = chatlist.admin_data;
    }
    chat.last_message = JSON.parse(chat.last_message);
    messagingStore.updateChatsList(chat); // if chat is NOT on screen
    messagingStore.setChatsLastMessage(data.id, chat.last_message);
    messagingStore.setSelectedTab(chat.status);
    messagingStore.onSelectChat(data.id);
  }
};

const onSearchCustomers = async (
  customerCode: string,
  locationCode: string
) => {
  const params = {
    fields: "*",
    "filter[customer_code][_eq]": customerCode,
    "filter[location_code][_eq]": locationCode,
  };
  const { data } = await searchCustomers(params);
  return data.data?.[0];
};

const showMoreChats = async () => {
  console.log("selected tab:", selectedTab.value);
  if (!isChatsDecreased.value[selectedTab.value]) {
    pageNumber.value[selectedTab.value] += 1;
  }

  const pageNumberLocal = pageNumber.value[selectedTab.value];

  const chats = await messagingStore.loadMoreChats(
    selectedTab.value,
    pageNumberLocal,
    15,
    selectedTab.value === ChatTypes.PENDING ? "asc" : "desc"
  );
  chats.forEach((chat: IChat) => {
    console.log("SOCKET: LOAD MORE join_chat by chat_id.........");
    // console.log(`join_chat.........${chat.id}`);
    socket.value.emit("join_chat", chat.id);
    socket.value.emit("join_chat", chat.id.toString()); // 0719 backward
  });
  chatListScroller.value[0]?.$el?.scrollTo({ top: 0, behavior: "smooth" });

  isShowingButtonLoadMore.value[selectedTab.value] = chats.length >= 15;
  isChatsDecreased.value[selectedTab.value] = false;
};
const initSocket = () => {
  socket.value.on("connect", () => {
    console.log("SOCKET:CONNECT -------");
    errSocket.value = false;
    console.log("SOCKET:join_chat by user_id -------", userProfile.value?.id);
    socket.value.emit("join_chat", userProfile?.value?.id);
    // console.log("userProfile", userProfile.value);
    // console.log("CHATLIST", chatsList.value);
    // debugger;
    chatsList.value.forEach((chat) => {
      console.log(`SOCKET:join_chat: ${chat.id}`, typeof chat.id);
      // ??? 0707
      // console.log(chat.id);
      // console.log(typeof chat.id);
      // console.log(typeof chat.id.toString());
      // socket.value.emit("join_chat", chat.id); // original
      socket.value.emit("join_chat", chat.id.toString()); // 0719 backward
      // socket.value.emit("join_chat", chat.id.toString()); //??? 0707
      // socket.value.emit("join_chat", parseInt(chat.id));
    });
  });

  // socket.value.io.on("connect_error", (err: any) => {
  //   console.log("SOCKET: connect_error", err);
  // });

  // socket.value.io.on("reconnect", (err: any) => {
  //   console.log("SOCKET: reconnect", err);
  // });

  // socket.value.io.on("reconnect_attempt", (err: any) => {
  //   console.log("SOCKET: reconnect_attempt", err);
  // });

  socket.value.io.on("error", (err: any) => {
    console.log("socket error", err);
    errSocket.value = true;
    Notify.create({
      message: "Refresh Your Page to connect to Chats",
      position: "top",
      type: "negative",
    });
  });
  socket.value.on("chat_updated", (data: SocketChatUpdated) => {
    console.log("SOCKET: chat_updated", data);
    const targetChatId = data.document?.id;

    const chat = chatsList.value.find(
      (chat: IChat) => chat.id === targetChatId
    );
    if (chat) {
      if (data?.update_fields?.conversation_type) {
        messagingStore.changeConversationType(
          chat?.id,
          data?.update_fields?.conversation_type
        );
      }
      if (data?.update_fields?.admin) {
        messagingStore.changeAdminChatListById(
          chat?.id,
          data?.update_fields?.admin
        );
      }
      if (data?.update_fields?.status) {
        messagingStore.updateChatsList(chat, data.document.status);
        console.log("  SOCKET:status change");
        console.log(getSelectedChat.value);
        if (
          getSelectedChat?.value &&
          getSelectedChat?.value.id === data.document.id
        ) {
          messagingStore.updateChatTabSelected(data.update_fields.status);
          // messagingStore.setSelectedTab(data.update_fields.status);
        }
        let message;
        if (data.update_fields.status !== "waiting") {
          switch (data.update_fields.status) {
            case "ongoing":
              // message = `Chat has been taken by ${
              //   userProfile.value?.first_name
              // } ${userProfile.value?.last_name || ""}`;
              message = `Chat ${data.document?.name} has been taken. Check ONGOING state`;
              break;
            case "closed":
              message = `${data.document?.name} chat has been closed`;
              break;
          }
          Notify.create({
            message,
            type: "positive",
            color: "primary",
            position: "top",
          });
        }
      }
      if (data.update_fields.expiration_timestamp) {
        messagingStore.changeExpiry(
          chat?.id,
          data?.update_fields?.expiration_timestamp
        );
      }

      if (data?.update_fields?.mode) {
        messagingStore.changeModeChatListById(chat?.id, data.document?.mode);
        if (
          getSelectedChat?.value &&
          getSelectedChat.value.id === data.document.id
        ) {
          // console.log(data);
          // console.log(data.document.id);
          getSelectedChat.value.mode = data.update_fields.mode;
        }
        if (data.update_fields.mode === "CS-Agent") {
          Notify.create({
            message: `The ${data.document.name} Bot has been ended`,
            type: "positive",
            color: "primary",
            position: "top",
          });
        }
      }
      messagingStore.sortChatsList();
    }
  });
  socket.value.on("message_created", async (data: SocketMessage) => {
    console.log("message_created", data);
    const { document } = data;
    if (document) {
      messagingStore.setChatsLastMessage(document.chat_id as string, document);
    }
    messagingStore.sortChatsList();
  });
  socket.value.on("contact_created", async (data: any) => {
    console.log("SOCKET: contact_created", data);
    // const response = await getCustomer(data.customers_id);
    // const customer = respose?.data?.data;
    const customer = await customerStore.fetchCustomer(data.customers_id);
    console.log(customer);

    const chatFound = chatsList.value.find(
      (chat: IChat) => chat.contacts_id === data.contacts_id
    );
    let contact = null;
    // if (customer?.contacts.length === 1) {
    //   contact = customer?.contacts[0].contacts_id;
    // } else {
    //   const resContact = await getContact(data.contacts_id);
    //   contact = resContact?.data?.data[0];
    // }

    if (chatFound !== undefined) {
      const resContact = await getContact(data.contacts_id);
      contact = resContact?.data?.data[0];
      if (getSelectedChat?.value && getSelectedChat.value.id === chatFound.id) {
        console.log("current chat found");
        contactStore.setCurrentCustomerId(customer.id);
        contactStore.setContact(contact);
        customerStore.setCustomer(customer);
      }
      chatFound.customers_id = data.customers_id;
      chatFound.customer_company_name_en = customer.customer_company_name_en;
      chatFound.contact_first_name = contact.first_name;
      chatFound.contact_last_name = contact.last_name;
      // socket.value.emit("join_chat", data.id);
      // useContactStore().setFirstname(contact.first_name);
    }
    // no need to explictly call getContact. comment out for now.
    // const contact = await getContact(data.document.contact_id);
    // getSelectedChat.value.contact_first_name =
    //   contact.data.data[0].first_name;
    // useContactStore().setFirstname(contact.data.data[0].first_name);
  });
  socket.value.on("user_added", async (data: any) => {
    console.log("SOCKET_EVENT: user_added", data);
    // console.log(chatsList.value);
    // const findChat = chatsList.value.find(
    //   (chat) => chat.chat_id === data.chat_id
    // );
    // console.log("findChat");
    // console.log(findChat);
    // if (!findChat) {
    //   chatsList.value.unshift({ members: "[]", ...data });
    // }
    // const chatObj = await getChatByID(data.chat_id);
    // const chatIndex = chatsList.value.findIndex(
    //   (chat) => chat.chat_id === chatObj.chat_id
    // );

    // if (chatIndex > -1) {
    //   chatsList.value[chatIndex] = chatObj;
    // }

    // socket.value.emit("join_chat", data.chat_id);
    // Notify.create({
    //   message: `You have been added to chat`,
    //   color: "blue-9",
    //   position: "top",
    //   type: "positive",
    // });
  });
  socket.value.on("chat_created", async (data: SocketChat) => {
    console.log("SOCKET chat_created:", data);
    const chatIndex = chatsList.value.findIndex((chat) => chat.id === data.id);
    if (chatIndex < 0) {
      Notify.create({
        message: `You have been added to chat ${data.name}`,
        color: "primary",
        position: "top",
        type: "positive",
      });
      try {
        if (data?.status === ChatTypes.PENDING) {
          chatsList.value.push(data as IChat);
        } else {
          chatsList.value.unshift(data as IChat);
        }
        const chat = await getChatByID(data.id);
        chat.last_message = JSON.parse(chat.last_message);
        chat.admin_data = allUsers.value.find(
          (user) => user.user_id === chat.admin
        );
        const index = chatsList.value.findIndex((chat) => chat.id === data.id);
        chatsList.value[index] = chat;
      } catch (error) {}
      // Notify.create({
      //   message: `You have been added to chat ${data.name}`,
      //   color: "blue-9",
      //   position: "top",
      //   type: "positive",
      // });
      // const findChat = chatsList.value.find((chat) => chat.id === data.id); // ??? 0707
      // console.log(" CHAT_FOUND:", findChat);
      // if (!findChat) {
      //   const chat = await getChatByID(data.id);
      //   // chat.id = chat.id.toString(); // ??? 0707
      //   console.log(" CHAT_CREATE:", chat);
      //   chat.last_message = JSON.parse(chat.last_message);
      //   chat.admin_data = allUsers.value.find(
      //     (user) => user.user_id === chat.admin
      //   );
      //   if (chat?.status === ChatTypes.PENDING) {
      //     chatsList.value.push(chat);
      //   } else {
      //     chatsList.value.unshift(chat);
      //   }
      //   socket.value.emit("join_chat", data.id.toString());
      // }
      socket.value.emit("join_chat", data.id.toString());
    }
    messagingStore.sortChatsList();
  });
  // the event is removed
  // Should be refactoring
  socket.value.on("botsession_created", async (data: any) => {
    console.log("botsession_created", data);
    const { document } = data;
    const { isConfirmed } = await Swal.fire({
      icon: "info",
      title: "Incoming Profile",
      html:
        "Customer Name: " +
        document?.summary?.customer_name +
        "</br>" +
        "Customer Code: " +
        document?.summary?.customer_code +
        "</br>" +
        "Location Code: " +
        document?.summary?.location_code +
        "</br>" +
        "Preferred Language: " +
        document?.summary?.preferred_language,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Load Profile",
    });

    const name = data.document.name.split(" ")[0];

    Notify.create({
      message: `Chat ${name} has been finished`,
      color: "blue-9",
      position: "top",
      type: "positive",
    });

    const chat = chatsList.value.find(
      (chat) => chat.id === document.session_id
    );
    if (isConfirmed) {
      const customer = (await onSearchCustomers(
        document?.summary?.customer_code,
        document?.summary?.location_code
      )) as any;
      if (chat) {
        if (customer?.id) {
          messagingStore.onSelectChat(chat?.id);
          await customerStore.fetchCustomer(customer.id);
          rightDrawerOpen.value = true;
        } else {
          await closeBot(chat?.id);
          messagingStore.changeModeChatListById(chat?.id, "CS-Agent");
          Notify.create({
            message: "The Bot has been ended",
            color: "primary",
            position: "top",
            type: "positive",
          });
        }
      }
    }
  });
};

onMounted(async () => {
  await messagingStore.getWabaUsers();
  await messagingStore.fetchChats();
  const socketUrl = process.env.SOCKETS_URL as string;
  console.log(socketUrl);
  socket.value = io(socketUrl, {
    reconnectionDelayMax: 30000,
    extraHeaders: {
      authorization: `${userInfo.value.access_token}`,
    },
    // transports: ["websocket"],
  });
  initSocket();
  // messagingStore.initSocket();
});

onBeforeUnmount(() => {
  socket.value.disconnect();
  chatsList.value.forEach((chat) => {
    socket.value.emit("leave_chat", chat.id);
  });
});
</script>

<style lang="scss" scoped>
.chat-panel {
  flex-flow: column;
}
</style>
