<template>
  <q-layout class="message-layout" view="lHr lpR lFr">
    <q-drawer
      show-if-above
      bordered
      v-model="leftDrawerOpen"
      side="left"
      :width="leftDrawerWidth"
    >
      <!-- left side -->
      <ChatPanel />
      <!-- draggable -->
      <SpliteLine @update="update" />
    </q-drawer>
    <q-page-container>
      <RouterView v-slot="{ Component }">
        <Transition name="slide-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </q-page-container>
    <q-drawer
      v-model="rightDrawerOpen"
      class="bg-white q-pa-md"
      side="right"
      :breakpoint="560"
      bordered
      :width="rightDrawerWidth"
      behavior="desktop"
    >
      <!-- drawer content -->
      <Message />
    </q-drawer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import ChatPanel from "./ChatPanel.vue";
import Message from "./Message.vue";
import useMessagingStore from "src/stores/modules/messaging";
import SpliteLine from "src/components/SpliteLine/SpliteLine.vue";
const messagingStore = useMessagingStore();
const leftDrawerWidth = ref(300);
const rightDrawerWidth = ref(450);
const rightDrawerOpen = computed({
  set: (value: boolean) => messagingStore.setRightDrawerOpen(value),
  get: () => messagingStore.rightDrawerOpen,
});
const leftDrawerOpen = computed({
  set: (value: boolean) => messagingStore.setLeftDrawerOpen(value),
  get: () => messagingStore.leftDrawerOpen,
});
const resetLeftWidth = () => {
  if (window.innerWidth > 1023) {
    leftDrawerWidth.value = 300;
    rightDrawerWidth.value = 450;
  } else {
    leftDrawerWidth.value = rightDrawerWidth.value = window.innerWidth - 1;
  }
};
resetLeftWidth();
const update = (val: number) => {
  leftDrawerWidth.value -= val;
};

onMounted(() => {
  window.addEventListener("resize", resetLeftWidth);
  // fixed mobile strange bug;
  messagingStore.setLeftDrawerOpen(true);
});
onBeforeUnmount(() => {
  removeEventListener("resize", resetLeftWidth);
});
</script>

<style lang="scss" scoped>
.message-layout {
  :deep(.q-drawer) {
    position: fixed;
  }
}
</style>
