<template>
  <q-list
    class="chat-panel bg-[#f2f3f7] pb-14 h-full flex flex-col overflow-x-hidden"
  >
    <!-- search part -->
    <q-item-label header>
      <div class="logo-holder mb-3 flex items-center gap-3">
        <img class="w-10" src="~assets/images/logo.svg" />
        <p class="font-[800] text-[#231815] text-2xl">ChaQ</p>
      </div>

      <q-input v-model="seachText" placeholder="Search ..." outlined dense>
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append>
          <q-icon name="reorder" class="cursor-pointer" />
        </template>
        <template v-slot:after>
          <q-btn
            unelevated
            color="primary"
            :icon="chatToggleLabel.state.icon"
            @click="fetchCustomers"
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
      >
        <ChatList :type="tab.name" :filter-text="seachText" />
      </q-tab-panel>
    </q-tab-panels>
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
import { IChat, SocketMessage } from "src/types/MessagingTypes";
import { closeBot, startNewChat, getContactByChatId } from "src/api/messaging";
import useUserInfoStore from "src/stores/modules/userInfo";
import useCustomerStore from "src/stores/modules/customer";
import { searchCustomers, getCustomer } from "src/api/customers";
import { Notify } from "quasar";
const rightDrawerOpen: any = inject("rightDrawerOpen");

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
const seachText = ref("");
const userInfoStore = useUserInfoStore();
const { userInfo, userProfile } = storeToRefs(userInfoStore);
const chatToggleLabel: ChatToggleType = reactive({
  state: ChatToggleLabel.SHOW,
});
const messagingStore = useMessagingStore();
const { chatsList, selectedTab, getSelectedChatId } =
  storeToRefs(messagingStore);
const showCustomerDialog = ref(false);
const customerStore = useCustomerStore();
const socket = ref();
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

watch(chatsList, (list) => {
  list.forEach((chat) => {
    socket.value.emit("join_chat", chat.id);
  });
});

watch(getSelectedChatId, () => {
  messagingStore.cleanTotalUnread();
});

const socketUrl = process.env.SOCKETS_URL as string;
console.log(socketUrl);
socket.value = io(socketUrl, {
  reconnectionDelayMax: 30000,
  extraHeaders: {
    authorization: `${userInfo.value.access_token}`,
  },
});

const fetchCustomers = async () => {
  showCustomerDialog.value =
    chatToggleLabel.state.icon === ChatToggleLabel.SHOW.icon;
};

const chooseCustomer = async (customer: any) => {
  customerStore.$reset();
  const [data] = await startNewChat(customer.id);

  const response = await getCustomer(customer.id);
  const customerObj = response.data.data;
  customerStore.setCustomer(customer);

  data.customer_company_name_en = customerObj.customer_company_name_en;
  messagingStore.updateChatsList(data);
  messagingStore.onSelectChat(data.id);
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

const initSocket = () => {
  try {
    socket.value.on("connect", () => {
      socket.value.emit("join_chat", userProfile?.value?.id);
    });
    socket.value.io.on("error", () => {
      console.log("socket error");
    });
    socket.value.on("chat_updated", (data: any) => {
      console.log("chat_updated", data);
      const chat = chatsList.value.find(
        (chat: IChat) => chat.id === data.document?.id
      );
      if (chat) {
        messagingStore.changeModeChatListById(chat?.id, data.document?.mode);
        messagingStore.updateChatsList(chat, data.document?.status);
        if (data.document?.mode !== "bot")
          Notify.create({
            message: `${data.document?.name} has been finished`,
            type: "positive",
            color: "primary",
            position: "top",
          });
      }
    });
    socket.value.on("message_created", async (data: SocketMessage) => {
      console.log("message_created", data);
      const { document } = data;
      if (document) {
        messagingStore.setChatsLastMessage(
          document.chat_id as string,
          document
        );
      }
    });
    socket.value.on("contact_created", async (data: any) => {
      console.log("contact_created", data);
    });
    socket.value.on("user_added", async (data: any) => {
      console.log("SOCKET_EVENT: user_added", data);
      console.log(chatsList.value);
      const findChat = chatsList.value.find(
        (chat) => chat.chat_id === data.chat_id
      );
      console.log("findChat");
      console.log(findChat);
      if (!findChat) {
        chatsList.value.unshift({ members: "[]", ...data });
      }
      socket.value.emit("join_chat", data.chat_id);
    });
    socket.value.on("chat_created", async (data: any) => {
      console.log("chat_created", data);
      const contact = await getContactByChatId(data.id);
      console.log("contact retrieved when chat_created event: ", data);
      data.contacts_id = contact.contacts_id;
      chatsList.value.unshift({ members: "[]", ...data });
      socket.value.emit("join_chat", data.id);
    });
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
            Notify.create({
              message: "The chatbot has been ended",
              color: "blue-9",
              position: "top",
              type: "positive",
            });
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  messagingStore.fetchChats();
  initSocket();
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
