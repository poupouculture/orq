<template>
  <div style="background: white">
    <q-layout view="lHh Lpr lFf">
      <Drawer v-if="!loading" :chat-list="chats" />
      <q-page-container>
        <q-page padding>
          <router-view />
        </q-page>
      </q-page-container>
      <ChatMessages />
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

const loading: Ref<boolean> = ref(true);

onMounted(async () => {
  await messagingStore.fetchChats(ChatTypes.PENDING);
  loading.value = false;
});

const chats = computed(() => messagingStore.getChats);
</script>
