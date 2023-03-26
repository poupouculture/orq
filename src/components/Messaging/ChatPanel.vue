<template>
  <q-list class="chat-panel pb-14 h-full flex flex-col overflow-x-hidden">
    <!-- search part -->
    <q-item-label header>
      <img class="q-mb-lg w-20" src="~assets/images/logo.svg" />
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
      <!-- what is this piece for ???  -->
      <!-- <q-virtual-scroll
        v-if="chatToggleLabel.state.icon === ChatToggleLabel.HIDE.icon"
        style="max-height: 300px"
        :items="data.customers"
        separator
        v-slot="{ item, index }"
        class="q-mt-sm"
      >
        <q-item :key="index" class="q-pa-sm" dense>
          <q-item-section>
            <q-item-label class="row justify-between">
              <div>
                <q-avatar class="rounded-avatar q-mr-sm" size="md">
                  <img src="https://cdn.quasar.dev/img/avatar.png" />
                </q-avatar>
                {{ TrimWord(`${item.first_name} ${item.last_name}`) }}
              </div>
              <q-btn
                round
                color="primary"
                size="sm"
                icon="add"
                @click="startNewChat(item)"
              />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-virtual-scroll> -->
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
    <q-tab-panels class="h-full" v-model="selectedTab" animated swipeable>
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
import type { Ref } from "vue";
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

// import {
//   db,
//   collection,
//   onSnapshot,
//   auth,
//   signInWithCustomToken,
// } from "src/boot/firebase";

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
const firebaseToken: Ref<string> = ref("");
const snapshotCancel = ref();
const userInfoStore = useUserInfoStore();
const { getFirebaseToken } = storeToRefs(userInfoStore);
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

// watch(chatsList, (list) => {
//   list.forEach((chat) => {
//     snapshotMessage(chat.id);
//   });
// });

watch(getSelectedChatId, () => {
  messagingStore.cleanTotalUnread();
});

const fetchCustomers = async () => {
  showCustomerDialog.value =
    chatToggleLabel.state.icon === ChatToggleLabel.SHOW.icon;
  // if (chatToggleLabel.state.icon === ChatToggleLabel.SHOW.icon) {
  // emit("showCustomerDialog", true);
  // const {
  //   data: { data: customers },
  // } = await getCustomersWithContacts();
  // data.customers = customers;
  // chatToggleLabel.state = ChatToggleLabel.HIDE;
  // } else {
  // emit("showCustomerDialog", false);
  // chatToggleLabel.state = ChatToggleLabel.SHOW;
  // }
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

// const snapshotChats = async () => {
//   const loggedInUser = await signInWithCustomToken(auth, firebaseToken.value);
//   if (loggedInUser) {
//     let snapshoted = false;
//     snapshotCancel.value = onSnapshot(
//       collection(db, "chats"),
//       async (querySnapshot: any) => {
//         for (const change of querySnapshot.docChanges()) {
//           if (snapshoted) {
//             const { status } = change.doc.data();
// const chat = chatsList.value.find(
//   (chat: IChat) => chat.id === change.doc.id
// );
// if (chat) {
//   messagingStore.updateChatsList(chat, status);
// }
//             // else {
//             //   // 考虑直接调用接口
//             // }
//           }
//         }
//         snapshoted = true;
//       }
//     );
//   }
// };

// const snapshotMessage = (chatId: string) => {
//   let snapshoted = false;
//   if (!getChatSnapshotMessage.value[chatId]) {
//     const snpshotCancel = onSnapshot(
//       collection(db, "messages", chatId, "members"),
//       async (querySnapshot: any) => {
//         for (const change of querySnapshot.docChanges()) {
//           if (snapshoted) {
//             const data = change.doc.data();
//             console.log(data);
//             let content;
//             try {
//               content =
//                 typeof data.content === "string"
//                   ? JSON.parse(data.content)
//                   : data.content;
//             } catch (e) {
//               content = { text: data.content, type: "text" };
//             }
//             if (data.date_created) {
//               messagingStore.setChatsLastMessage(chatId, {
//                 ...data,
//   id: data.last_message_id,
//   content,
//   direction:
//     data.status === MessageStatus.SENT
//       ? Direction.OUTGOING
//       : Direction.INCOMING,
// });
//             }
//           }
//         }
//         snapshoted = true;
//       }
//     );
//     messagingStore.setChatSnapshotMessage(chatId, snpshotCancel);
//     // this.setChatSnapshotGroup(chatId, snpshotCancel);
//   }
// };

const initSocket = () => {
  socket.value = io("https://beams.synque.ca", {
    reconnectionDelayMax: 30000,
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
  firebaseToken.value = getFirebaseToken.value;
  messagingStore.fetchChats();
  // snapshotChats();
  initSocket();
});
onBeforeUnmount(() => {
  snapshotCancel.value();
  socket.value.disconnect();
});
</script>

<style lang="scss" scoped>
.chat-panel {
  flex-flow: column;
}
</style>
