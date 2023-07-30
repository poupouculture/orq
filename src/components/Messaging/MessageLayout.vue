<template>
  <q-layout view="lHr lpR lFr" class="!h-screen !min-h-0">
    <q-drawer
      show-if-above
      bordered
      side="left"
      v-model="leftDrawerOpen"
      :width="leftDrawerWidth"
    >
      <!-- left side -->
      <ChatPanel />
      <!-- draggable -->
      <SpliteLine @update="update" />
    </q-drawer>
    <q-page-container class="h-screen">
      <RouterView />
    </q-page-container>
    <q-drawer
      bordered
      class="q-pa-md"
      side="right"
      v-model="rightDrawerOpen"
      :width="rightDrawerWidth"
    >
      <!-- drawer content -->
      <Messaging />
    </q-drawer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, provide, onBeforeUnmount, onMounted } from "vue";
import ChatPanel from "./ChatPanel.vue";
// import Message from "./Message.vue";
import Messaging from "pages/Messaging/Index.vue";
import useMessagingStore from "src/stores/modules/messaging";
import SpliteLine from "src/components/SpliteLine/SpliteLine.vue";
const messagingStore = useMessagingStore();
const leftDrawerWidth = ref(350);
const rightDrawerWidth = ref(550);
const leftDrawerOpen = ref(true);
const rightDrawerOpen = ref(false);
// const rightDrawerOpen = computed({
//   set: (value: boolean) => messagingStore.setRightDrawerOpen(value),
//   get: () => messagingStore.rightDrawerOpen,
// });
// const leftDrawerOpen = computed({
//   set: (value: boolean) => messagingStore.setLeftDrawerOpen(value),
//   get: () => {
//     console.log(messagingStore.leftDrawerOpen);
//     return messagingStore.leftDrawerOpen;
//   },
// });
const resetLeftWidth = () => {
  if (window.innerWidth < 768) {
    leftDrawerWidth.value = rightDrawerWidth.value = window.innerWidth;
  }
};
resetLeftWidth();
const update = (val: number) => {
  leftDrawerWidth.value -= val;
};

provide("leftDrawerOpen", leftDrawerOpen);
provide("rightDrawerOpen", rightDrawerOpen);

onBeforeUnmount(() => {
  messagingStore.$reset();
  // window.document.documentElement.classList.remove("overflow-hidden");
});

onMounted(async () => {
  // window.document.documentElement.classList.add("overflow-hidden");
});
</script>

<style lang="scss" scoped></style>
