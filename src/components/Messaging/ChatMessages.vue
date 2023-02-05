<template>
  <q-drawer
    side="right"
    show-if-above
    bordered
    :width="300"
    :breakpoint="500"
    class="bg-white q-pa-md"
  >
    <q-scroll-area style="height: 70%">
      <div class="row items-center">
        <q-avatar class="rounded-avatar">
          <img src="https://cdn.quasar.dev/img/avatar.png" />
        </q-avatar>
        <div class="q-ml-md">
          <div class="text-h6">{{ getCustomerName }}</div>
          <div class="text-grey-5">{{ getContactNumber }}</div>
        </div>
      </div>
      <div class="flex flex-col h-screen justify-between q-mt-lg">
        <div class="h-10">
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
      </div>
    </q-scroll-area>
    <footer class="fixed bottom-0 q-pa-xs q-pb-md" style="width: 90%">
      <div v-if="getSelectedTab === ChatTypes.ONGOING">
        <q-input
          v-model="message"
          dense
          borderless
          bg-color="grey-2"
          type="textarea"
          @keydown.enter.prevent="sendMessage"
        />
        <div class="row justify-end">
          <q-btn
            flat
            round
            color="grey"
            icon="insert_comment"
            size="md"
            class="q-mt-md"
            @click="showMessageTemplate = true"
          />
          <q-btn flat round color="grey" icon="mic" size="md" class="q-mt-md" />
          <q-btn
            flat
            round
            color="grey"
            icon="image"
            size="md"
            class="q-mt-md"
          />
          <div class="row justify-end q-mt-md">
            <q-btn
              color="primary"
              label="Send"
              class="dark-btn"
              @click="sendMessage"
            />
          </div>
        </div>
      </div>
      <div v-else>
        <div class="w-full p-4 flex gap-2 items-center bg-gray-200 rounded-md">
          <p class="text-gray-400 text-xs w-7/12">
            You are in preview mode of this chat
          </p>
          <button
            class="w-4/12 bg-primary text-white p-2 rounded-md shadow-md"
            @click="activateChat"
          >
            <q-icon name="message"></q-icon>
            Take it
          </button>
        </div>
      </div>
    </footer>
  </q-drawer>
  <MessageTemplateDialog
    v-model="showMessageTemplate"
    @hide="showMessageTemplate = false"
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import useMessagingStore from "src/stores/modules/messaging";
import useCustomerStore from "src/stores/modules/customer";
import {
  IMessage,
  Direction,
  Product,
  MessageType,
} from "../../types/MessagingTypes";
import MessageTemplateDialog from "./MessageTemplateDialog.vue";
import { startNewChat, updateChatStatus } from "src/api/messaging";
import { ChatTypes } from "src/constants/ChatKeyword";

const messagingStore = useMessagingStore();
const customerStore = useCustomerStore();

const emit = defineEmits(["newChatCreated"]);

const message: Ref<string> = ref("");
const showMessageTemplate: Ref<boolean> = ref(false);
const {
  getChats,
  getSelectedChatIndex,
  getContactNumber,
  getCustomerName,
  getSelectedTab,
} = storeToRefs(messagingStore);
const { getCustomer } = storeToRefs(customerStore);

const messages = computed<unknown[]>(() => {
  const arr: Array<IMessage> = messagingStore.getChatMessages;

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

const sendMessage = async () => {
  if (messages.value.length > 0) {
    const chat = getChats.value[getSelectedChatIndex.value];
    const chatId = chat.id;
    const contactNumber = getContactNumber.value;

    await messagingStore.sendChatTextMessage({
      chatId,
      messageProduct: Product.WHATSAPP,
      to: contactNumber as string,
      type: MessageType.TEXT,
      messageBody: message.value,
    });

    messagingStore.fetchChatMessagesByChatId(chatId);
  } else {
    startNewChat(getCustomer.value.id, message.value);

    messagingStore.fetchChats(ChatTypes.ONGOING);
    messagingStore.setSelectedTab(ChatTypes.ONGOING);

    emit("newChatCreated", ChatTypes.ONGOING);
  }

  message.value = "";
};

const activateChat = async () => {
  const chat = getChats.value[getSelectedChatIndex.value];
  const chatId = chat.id;
  await updateChatStatus(chatId, ChatTypes.ONGOING);
  emit("newChatCreated", ChatTypes.ONGOING);
};
</script>

<style scoped lang="scss">
.rounded-avatar {
  border-radius: 50% !important;
}
</style>
