<template>
  <q-drawer :modelValue="true" class="bg-grey-2" show-if-above bordered>
    <q-list>
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
      </q-item-label>
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
        <q-tab :name="ChatTypes.ONGOING" label="Ongoing 6" />
        <q-tab :name="ChatTypes.PENDING" label="Waiting 1" />
        <q-tab :name="ChatTypes.CLOSED" label="Closed 0" />
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
          <div v-for="(chat, index) in props.chatList" :key="index">
            <ContactCard
              :active="parseInt(index) === activeChat"
              :name="
                chat?.customers_id
                  ? TrimWord(`${chat.first_name} ${chat.last_name}`)
                  : 'Visitor'
              "
              :message="getLastMessage(JSON.parse(chat.last_message))"
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
  </q-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import { format } from "date-fns";
import ContactCard from "./ContactCard.vue";
import useMessagingStore from "src/stores/modules/messaging";
import useCustomerStore from "src/stores/modules/customer";
import { ChatTypes } from "src/constants/ChatKeyword";
import { Direction } from "src/types/MessagingTypes";
import TrimWord from "src/utils/trim-word";

const messagingStore = useMessagingStore();
const customerStore = useCustomerStore();

const props = defineProps({
  chatList: {
    type: Object,
    default: () => null,
  },
});
const emit = defineEmits(["changeTab"]);

const activeChat: Ref<number | null> = ref(null);
const tab: Ref<string> = ref(ChatTypes.PENDING);
const searchText: Ref<string> = ref("");
const tabs: Ref<ChatTypes[]> = ref([
  ChatTypes.PENDING,
  ChatTypes.ONGOING,
  ChatTypes.CLOSED,
]);
const { getChats } = storeToRefs(messagingStore);

const onChangeTab = (val: ChatTypes) => {
  messagingStore.setSelectedTab(val);
  emit("changeTab", val);
};

const dateFormat = (date: string) => {
  return format(new Date(date), "hh:mm aa");
};

interface LastMessage {
  content: string;
  direction: Direction;
  date_created: string;
}

const getDateFromLastMessage = (lastMessage: LastMessage) => {
  return lastMessage?.date_created;
};

const getLastMessage = (lastMessage: LastMessage) => {
  return lastMessage?.content;
};

const selectChat = (index: number) => {
  customerStore.$reset();

  activeChat.value = index;
  const { id: chatId } = props.chatList[index];

  messagingStore.setSelectedChatIndex(index);
  messagingStore.fetchChatMessagesByChatId(chatId);
  messagingStore.fetchContactNumber(getChats.value[index].contacts_id);

  if (props.chatList[index].customers_id) {
    const customerId = props.chatList[index].customers_id;
    customerStore.fetchCustomer(customerId);
  }
};
</script>

<style scoped>
.contact-card:hover {
  cursor: pointer;
}
</style>
:sp
