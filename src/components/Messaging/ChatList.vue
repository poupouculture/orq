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
        <q-tab name="ongoing" label="Ongoing 6" />
        <q-tab name="pending" label="Waiting 1" />
        <q-tab name="closed" label="Closed 0" />
      </q-tabs>
      <q-separator size="2px" style="margin-top: -2px" inset />
      <q-tab-panels v-model="tab" animated class="q-mt-md transparent">
        <q-tab-panel
          v-for="(tab_, tabIndex) in tabs"
          :key="tabIndex"
          :name="tab_"
        >
          <div v-for="(chat, index) in props.chatList" :key="index">
            <ContactCard
              :active="parseInt(index) === activeChat"
              :name="chat?.customer_name ? chat.customer_name : 'Visitor'"
              :message="chat.last_message_text"
              :time="dateFormat(chat.last_message_date)"
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
import { ref, onMounted } from "vue";
import type { Ref } from "vue";
import { format } from "date-fns";
import ContactCard from "./ContactCard.vue";
import useMessagingStore from "src/stores/modules/messaging";
import { ChatTypes } from "src/constants/ChatKeyword";

const messagingStore = useMessagingStore();

const props = defineProps({
  chatList: {
    type: Object,
    default: () => null,
  },
});
const emit = defineEmits(["changeTab"]);

const activeChat: Ref<number> = ref(0);
const tab: Ref<string> = ref("pending");
const searchText: Ref<string> = ref("");
const tabs: Ref<ChatTypes[]> = ref([
  ChatTypes.PENDING,
  ChatTypes.ONGOING,
  ChatTypes.CLOSED,
]);

onMounted(() => {
  selectChat(0);
});

const onChangeTab = (val: ChatTypes) => {
  emit("changeTab", val);
};

const dateFormat = (date: string) => {
  return format(new Date(date), "hh:mm aa");
};

const selectChat = (index: number) => {
  activeChat.value = index;
  const { chat_id: chatId } = props.chatList[index];

  messagingStore.fetchChatMessagesByChatId(chatId);
};
</script>

<style scoped>
.contact-card:hover {
  cursor: pointer;
}
</style>
