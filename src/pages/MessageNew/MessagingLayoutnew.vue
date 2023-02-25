<template>
  <q-layout class="message-layout" view="lHr lpR lFr">
    <q-drawer show-if-above bordered :model-value="leftDrawerOpen" side="left">
      <!-- left side -->
      <ChatPanel />
    </q-drawer>
    <q-page-container>
      <q-page padding>
        <RouterView v-slot="{ Component }">
          <Transition name="slide-fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </q-page>
    </q-page-container>
    <q-drawer
      class="bg-white q-pa-md right-drawer"
      :model-value="rightDrawerOpen"
      side="right"
      behavior="desktop"
      bordered
      :width="450"
    >
      <!-- drawer content -->
      <Message />
    </q-drawer>
  </q-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import ChatPanel from "src/pages/MessageNew/ChatPanel.vue";
import Message from "src/pages/MessageNew/Message.vue";
import useMessagingStore from "./messagenew";

const messagingStore = useMessagingStore();

const { rightDrawerOpen, leftDrawerOpen } = storeToRefs(messagingStore);
</script>

<style lang="scss" scoped>
.message-layout {
  :deep(.q-drawer--left) {
    position: fixed;
    width: 100% !important;
    @media screen and (min-width: 1024px) {
      width: 300px !important;
    }
  }
  :deep(.q-drawer--right) {
    position: fixed;
    width: 100% !important;
    @media screen and (min-width: 1024px) {
      width: 450px !important;
    }
  }
}
</style>
