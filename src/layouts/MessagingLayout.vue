<template>
  <div style="background: white">
    <q-layout view="lHh Lpr lFf">
      <Drawer :chat-list="chats.list" />
      <q-page-container>
        <q-page padding>
          <router-view />
        </q-page>
      </q-page-container>
      <ChatMessages />
    </q-layout>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import Drawer from "src/components/Messaging/ChatList.vue";
import ChatMessages from "src/components/Messaging/ChatMessages.vue";
import { ChatKeywords, ChatTypes } from "../constants/ChatKeyword";
import { getUserChats } from "../api/messages";

const chats = reactive({
  list: [],
});

onMounted(async () => {
  const { data } = await getUserChats({
    keyword: ChatKeywords.GET_CHATS,
    type: ChatTypes.PENDING,
  });
  chats.list = data;
});
</script>
