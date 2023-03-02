<template>
  <q-layout class="message-layout" view="lHr lpR lFr">
    <q-drawer
      show-if-above
      bordered
      :model-value="leftDrawerOpen"
      side="left"
      :width="leftDrawerWidth"
      @update:model-value="toggleLeftDrawer"
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
      :model-value="rightDrawerOpen"
      class="bg-white q-pa-md"
      side="right"
      :breakpoint="560"
      bordered
      :width="rightDrawerWidth"
      @update:model-value="toggleRightDrawer"
    >
      <!-- drawer content -->
      <Message />
    </q-drawer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import ChatPanel from "./ChatPanel.vue";
import Message from "./Message.vue";
import useMessagingStore from "src/stores/modules/messaging";
import SpliteLine from "src/components/SpliteLine/SpliteLine.vue";
const messagingStore = useMessagingStore();
const leftDrawerWidth = ref(300);
const rightDrawerWidth = ref(450);
const { rightDrawerOpen, leftDrawerOpen } = storeToRefs(messagingStore);
const toggleLeftDrawer = (val: boolean) => {
  messagingStore.setLeftDrawerOpen(val);
};
const toggleRightDrawer = (val: boolean) => {
  messagingStore.setRightDrawerOpen(val);
};
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
