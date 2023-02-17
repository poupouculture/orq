<template>
  <q-drawer v-model="openDrawer" class="bg-grey-2" show-if-above bordered>
    <q-list class="pb-14">
      <q-item-label header>
        <img class="q-mb-lg" src="../../assets/images/logo-invert.png" />
        <q-input
          v-model="searchText"
          placeholder="Search Chats..."
          outlined
          dense
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-icon name="reorder" class="cursor-pointer" />
          </template>
        </q-input>
        <q-btn
          unelevated
          color="primary"
          class="full-width q-mt-md"
          :label="chatToggleLabel.state.label"
          :icon="chatToggleLabel.state.icon"
          @click="fetchCustomers"
          dense
        >
        </q-btn>
        <q-virtual-scroll
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
        </q-virtual-scroll>
      </q-item-label>
      aaaa{{ tab }}
      <q-tabs
        v-model="tab"
        dense
        class="text-grey q-mt-md"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
        no-caps
        @update:model-value="onChangeTab"
      >
        <q-tab
          :name="ChatTypes.ONGOING"
          :label="`Ongoing ${countChats(ChatTypes.ONGOING)}`"
        />
        <q-tab
          :name="ChatTypes.PENDING"
          :label="`Waiting ${countChats(ChatTypes.PENDING)}`"
        />
        <q-tab
          :name="ChatTypes.CLOSED"
          :label="`Closed ${countChats(ChatTypes.CLOSED)}`"
        />
      </q-tabs>
      <q-separator size="2px" style="margin-top: -2px" inset />
      <q-tab-panels
        v-if="props.chatList"
        v-model="tab"
        animated
        class="q-mt-md transparent"
      >
        <q-tab-panel
          v-for="(tab_, tabIndex) in tabs"
          :key="tabIndex"
          :name="tab_"
        >
          <div v-for="(chat, index) in chats" :key="index">
            <ContactCard
              :active="chat.id === getSelectedChat.id"
              :name="
                chat?.customers_id
                  ? TrimWord(`${chat.first_name} ${chat.last_name}`)
                  : 'Visitor'
              "
              :message="TrimWord(getLastMessage(JSON.parse(chat.last_message)))"
              :time="
                dateFormat(
                  getDateFromLastMessage(JSON.parse(chat.last_message))
                )
              "
              :totalUnread="0"
              class="contact-card"
              @click="selectChat(parseInt(index))"
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-list>
    <footer class="w-full fixed bottom-0 q-pa-md">
      <div class="w-full flex justify-center items-center">
        <q-btn
          round
          flat
          color="grey"
          icon="home"
          size="md"
          class="px-2"
          @click="router.push('/')"
        />
        <q-btn round flat color="grey" icon="add_box" size="md" class="px-2" />
        <q-btn
          round
          flat
          color="grey"
          icon="chat_bubble"
          size="md"
          class="px-2"
        />
        <q-btn
          round
          flat
          color="grey"
          icon="notifications"
          size="md"
          class="px-2"
        />
        <q-btn-dropdown round flat color="grey" class="pl-2 pr-0">
          <template v-slot:label>
            <q-avatar size="md">
              <img src="https://cdn.quasar.dev/img/avatar1.jpg" />
            </q-avatar>
          </template>
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>menu 1</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>menu 2</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>menu 3</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </footer>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watchEffect } from "vue";
import type { Ref, PropType } from "vue";
import { storeToRefs } from "pinia";
import { format } from "date-fns";
import { useRouter } from "vue-router";
import ContactCard from "./ContactCard.vue";
import useMessagingStore from "src/stores/modules/messaging";
import useCustomerStore from "src/stores/modules/customer";
import { ChatTypes } from "src/constants/ChatKeyword";
import { Direction, ChatGroup } from "src/types/MessagingTypes";
import TrimWord from "src/utils/trim-word";
// import { getCustomersWithContacts } from "src/api/customers";
import { ICustomer } from "src/types/CustomerTypes";
import { Tabs } from "src/constants/Tabs";

// Interfaces
interface LastMessage {
  content: string;
  direction: Direction;
  date_created: string;
}

interface CustomerData {
  customers: Array<ICustomer>;
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
type ChatToggleType = {
  state: typeof ChatToggleLabel[keyof typeof ChatToggleLabel];
};

// Stores
const router = useRouter();
const messagingStore = useMessagingStore();
const customerStore = useCustomerStore();

// Props & Emits
const props = defineProps({
  chatList: {
    type: Array as PropType<ChatGroup[]>,
    default: () => [],
  },
  modelValue: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  "setChatId",
  "showCustomerDialog",
  "update:modelValue",
]);

// States
const activeChat: Ref<number | null> = ref(null);
const openDrawer = computed({
  set: (val: boolean) => emit("update:modelValue", val),
  get: () => props.modelValue,
});
const tab: Ref<string> = ref(ChatTypes.PENDING);
const searchText: Ref<string> = ref("");
const tabs: Ref<ChatTypes[]> = ref(Tabs);
const chatToggleLabel: ChatToggleType = reactive({
  state: ChatToggleLabel.SHOW,
});
const data: CustomerData = reactive({
  customers: [],
});
const { getSelectedTab, getSelectedChat, getShowChatList } =
  storeToRefs(messagingStore);
const { getCustomer } = storeToRefs(customerStore);

const chats = computed(
  () => props.chatList[tabs.value.indexOf(getSelectedTab.value)].chats
);

// Methods
const onChangeTab = (val: ChatTypes) => {
  messagingStore.setSelectedTab(val);
};

const selectChatByCustomer = (customerID: string) => {
  for (let index = 0; index < chats.value.length; index++) {
    const tempChat = chats.value[index];
    if (tempChat.customers_id === customerID) selectChat(index);
  }
};

defineExpose({ onChangeTab, selectChatByCustomer });

watchEffect(() => {
  openDrawer.value = getShowChatList.value;
  // dont remove this, it hanppend to mutch times
  // when take it or close conversation tab should change automatically
  tab.value = getSelectedTab.value;
});

const fetchCustomers = async () => {
  if (chatToggleLabel.state.icon === ChatToggleLabel.SHOW.icon) {
    emit("showCustomerDialog", true);
    // const {
    //   data: { data: customers },
    // } = await getCustomersWithContacts();

    // data.customers = customers;
    // chatToggleLabel.state = ChatToggleLabel.HIDE;
  } else {
    emit("showCustomerDialog", false);
    // chatToggleLabel.state = ChatToggleLabel.SHOW;
  }
};

const countChats = (status: ChatTypes) => {
  return props.chatList[tabs.value.indexOf(status)].chats.length;
};

const dateFormat = (date: string) => {
  return format(new Date(date), "hh:mm aa");
};

const getDateFromLastMessage = (lastMessage: LastMessage) => {
  return lastMessage?.date_created;
};

const getLastMessage = (lastMessage: LastMessage) => {
  return lastMessage?.content;
};

const selectChat = (index: number) => {
  customerStore.$reset();
  // close drawer when mobile view
  if (window.innerWidth <= 1024) {
    messagingStore.setShowChatList(false);
  }

  activeChat.value = index;
  const chat = chats.value[index];

  emit("setChatId", chat.id);

  messagingStore.setSelectedChatIndex(index);
  messagingStore.setSelectedChat(chat);
  messagingStore.fetchChatMessagesByChatId(chat.id, true);
  messagingStore.fetchContactNumber(chat.contacts_id);

  if (chat.first_name) {
    messagingStore.setCustomerName(`${chat.first_name}
  ${chat.last_name}`);
  } else {
    messagingStore.setCustomerName("Visitor");
  }

  if (chat.customers_id) {
    const customerId = chat.customers_id;
    customerStore.fetchCustomer(customerId);
  }
};

const startNewChat = async (user: ICustomer) => {
  const customerId = user.id;
  await customerStore.fetchCustomer(customerId);

  messagingStore.setCustomerName(`${user.first_name} ${user.last_name}`);
  const contactNumber = getCustomer.value.contacts[0].contacts_id.number;
  messagingStore.setContactNumber(contactNumber);

  chatToggleLabel.state = ChatToggleLabel.SHOW;
};
</script>

<style lang="scss" scoped>
:deep(.q-drawer) {
  width: 100% !important;
  @media screen and (min-width: 1024px) {
    width: 300px !important;
  }
}
.contact-card:hover {
  cursor: pointer;
}
</style>
