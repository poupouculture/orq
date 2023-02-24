<template>
  <div
    :class="{ 'bg-primary': active }"
    class="flex w-full contact-card q-pa-sm"
  >
    <q-avatar class="rounded-avatar q-mr-sm">
      <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
    </q-avatar>
    <q-item-section>
      <q-item-label :class="{ 'text-white': active }" class="text-h6 truncate">
        {{ name }}
      </q-item-label>
      <q-item-label caption lines="1" :class="{ 'text-white': active }">
        {{ message }}
      </q-item-label>
    </q-item-section>
    <q-item-section side top class="justify-between q-pb-sm">
      <q-item-label caption :class="{ 'text-white': active }">
        {{ time }}
      </q-item-label>
      <q-badge
        v-show="props.data.totalUnread"
        rounded
        color="red"
        :label="props.data.totalUnread"
      />
    </q-item-section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { format } from "date-fns";
import { storeToRefs } from "pinia";
import { getChatName } from "src/utils/trim-word";
import { IChat } from "src/pages/MessageNew/Message";
import useMessagingStore from "./messagenew";

export interface Props {
  data?: IChat;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({} as IChat),
});
const messagingStore = useMessagingStore();
const { selectedChatId } = storeToRefs(messagingStore);

const active = computed<boolean>(() => props.data.id === selectedChatId.value);
const name = computed<string>(() => getChatName(props.data));

const message = computed<string>(() => {
  const { last_message: lastMessage } = props.data;
  return JSON.parse(lastMessage)?.content;
});

const time = computed<string>(() => {
  const { last_message: lastMessage } = props.data;
  const parseMessage = JSON.parse(lastMessage);
  const dateCreated = parseMessage?.date_created;
  return dateCreated && format(new Date(dateCreated), "hh:mm aa");
});

// const selectChat = () => {
//   messagingStore.setSelectedChatId(props.data.id);
// };
</script>

<style scoped lang="scss">
.rounded-avatar {
  border-radius: 50% !important;
}
.contact-card {
  border-radius: 10px;
}
</style>
