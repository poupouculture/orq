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
} from "vue";
import { storeToRefs } from "pinia";
import { io } from "socket.io-client";
import { ChatTypes } from "src/constants/ChatKeyword";
import useMessagingStore from "src/stores/modules/messaging";
import ChatList from "./ChatList.vue";
import ChatListFooter from "./ChatListFooter.vue";
import CustomerDialog from "./CustomerDialog.vue";
import { IChat } from "src/types/MessagingTypes";
import { startNewChat } from "src/api/messaging";
import useUserInfoStore from "src/stores/modules/userInfo";
import useCustomerStore from "src/stores/modules/customer";

interface MessageCreate {
  id: string;
  messages: any[];
}

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
  state: typeof ChatToggleLabel[keyof typeof ChatToggleLabel];
};
const seachText = ref("");
const userInfoStore = useUserInfoStore();
const { userInfo } = storeToRefs(userInfoStore);
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

socket.value = io("https://beams.synque.ca", {
  reconnectionDelayMax: 30000,
  extraHeaders: {
    authorization: `${userInfo.value.access_token}`,
  },
});

const fetchCustomers = async () => {
  showCustomerDialog.value =
    chatToggleLabel.state.icon === ChatToggleLabel.SHOW.icon;
};

const chooseCustomer = async (user: any) => {
  customerStore.$reset();
  const [data] = await startNewChat(user.id);
  messagingStore.updateChatsList(data);
  messagingStore.onSelectChat(data.id);
  if (data.customers_id) {
    customerStore.fetchCustomer(data.customers_id);
  }
};

const initSocket = () => {
  socket.value.on("connect", () => {
    console.log("connect", socket.value.connected);
  });
  socket.value.io.on("error", () => {
    console.log("socket error");
  });
  socket.value.on("chat_updated", (data: any) => {
    console.log("chat_updated", data);
    const chat = chatsList.value.find((chat: IChat) => chat.id === data.id);
    if (chat) {
      messagingStore.updateChatsList(chat, data.status);
    }
  });
  socket.value.on("message_created", (data: any) => {
    console.log("message_created", data);
    const { id, messages } = data as MessageCreate;
    messagingStore.setChatsLastMessage(id, messages[0]);
  });
  socket.value.on("chat_created", (data: any) => {
    console.log("chat_created", data);
    messagingStore.chatCreate(data.status, data.id);
  });
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
