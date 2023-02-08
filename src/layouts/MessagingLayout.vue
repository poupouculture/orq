<template>
  <div style="background: white">
    <q-layout view="lHh Lpr lFf">
      <Drawer
        ref="chatList"
        v-if="!loading"
        :chat-list="chats"
        @change-tab="fetchChats"
      />
      <q-page-container>
        <q-page padding>
          <router-view />
        </q-page>
      </q-page-container>
      <ChatMessages @new-chat-created="changeTab" />
    </q-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import type { Ref } from "vue";
import Drawer from "src/components/Messaging/ChatList.vue";
import ChatMessages from "src/components/Messaging/ChatMessages.vue";
import useMessagingStore from "src/stores/modules/messaging";
import { ChatTypes } from "src/constants/ChatKeyword";

const messagingStore = useMessagingStore();

const chatList = ref();
const loading: Ref<boolean> = ref(true);

onMounted(async () => {
  localStorage.removeItem("chatMessages");
  await fetchChats(ChatTypes.PENDING);
  loading.value = false;
});

const chats = computed(() => messagingStore.getChats);

const fetchChats = async (type: ChatTypes) => {
  messagingStore.fetchChats(type);
};

const changeTab = (val: ChatTypes) => {
  chatList.value.onChangeTab(val);
};
</script>
<style scoped lang="scss">
:deep(.q-page-container) {
  @media screen and (max-width: 1024px) {
    padding-right: 0px !important;
  }
}
</style>
