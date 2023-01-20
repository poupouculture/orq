<template>
  <q-drawer
    side="right"
    show-if-above
    bordered
    :width="300"
    :breakpoint="500"
    class="bg-white q-pa-md"
  >
    <q-scroll-area style="height: 100%">
      <div class="row items-center">
        <q-avatar class="rounded-avatar">
          <img src="https://cdn.quasar.dev/img/avatar.png" />
        </q-avatar>
        <div class="q-ml-md">
          <div class="text-h6">Visitor</div>
          <div class="text-grey-5">livechat 01</div>
        </div>
      </div>
      <div class="q-mt-lg">
        <q-chat-message
          v-for="(message, index) in messages"
          :key="index"
          :text="message.items"
          :text-color="
            message.direction === Direction.OUTGOING ? 'white' : 'black'
          "
          :sent="message.direction === Direction.OUTGOING ? true : false"
          :bg-color="
            message.direction === Direction.OUTGOING ? 'primary' : 'grey-3'
          "
        />
      </div>
    </q-scroll-area>
    <q-layout>
      <q-page-container>
        <q-page padding>
          <q-page-sticky position="bottom">
            <q-input
              v-model="message"
              dense
              borderless
              bg-color="grey-2"
              type="textarea"
              width="100%"
            />
          </q-page-sticky>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Ref } from "vue";
import useMessagingStore from "src/stores/modules/messaging";
import { IMessage, Direction } from "../../types/MessagingTypes";

const messagingStore = useMessagingStore();

const message: Ref<string> = ref("");

const messages = computed(() => {
  const arr: Array<IMessage> = messagingStore.getChatMessages;
  console.log(arr[arr.length - 1]);

  type GroupedMessages = {
    items: Array<IMessage["content"]>;
    direction: IMessage["direction"];
  };

  let currentDirection = "";
  const groupedMessages: Array<GroupedMessages> = [];

  arr.forEach((item: IMessage) => {
    if (currentDirection === item.direction) {
      groupedMessages[groupedMessages.length - 1].items.push(item.content);
    } else {
      groupedMessages.push({
        items: [item.content],
        direction: item.direction,
      });
    }

    currentDirection = item.direction;
  });

  return groupedMessages;
});
</script>

<style scoped lang="scss">
.rounded-avatar {
  border-radius: 50% !important;
}
</style>
