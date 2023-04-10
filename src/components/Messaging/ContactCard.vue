<template>
  <div
    :class="{ 'bg-primary': active }"
    class="flex w-full contact-card q-pa-sm"
  >
    <q-avatar class="rounded-avatar q-mr-sm">
      <img :src="profileIcon" />
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
import { getChatNameEn } from "src/utils/trim-word";
import { IChat, MessageType } from "src/types/MessagingTypes";
import useMessagingStore from "src/stores/modules/messaging";
import profileIcon from "src/assets/images/profileicon.svg";

export interface Props {
  data?: IChat;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({} as IChat),
});
const messagingStore = useMessagingStore();
const { selectedChatId } = storeToRefs(messagingStore);

const active = computed<boolean>(() => props.data.id === selectedChatId.value);
const name = computed<string>(() => getChatNameEn(props.data));

const messageTemplate = (content: any) => {
  const components = content?.template?.components ?? content?.components;
  if (components) {
    const component = components?.find(
      (component: any) => component?.type === "body"
    );
    if (component) return component?.parameters[0].text;
  }

  return content?.template_content || content?.template?.text;
};

const message = computed<string>(() => {
  const { last_message: lastMessage } = props.data;
  if (!lastMessage) return;
  switch (lastMessage?.content?.type) {
    case MessageType.IMAGE:
      return "[pic]";
    case MessageType.AUDIO:
      return "[audio]";
    case MessageType.TEXT:
      return lastMessage?.content?.text;
    case MessageType.TEMPLATE:
      return messageTemplate(lastMessage.content);
    case MessageType.DOCUMENT:
      return "[file]";
    default:
      return lastMessage?.content?.file_name;
  }
});

const time = computed<string>(() => {
  const { last_message: lastMessage } = props.data;
  const dateCreated = lastMessage?.date_created;
  return dateCreated && format(new Date(dateCreated), "p");
});
</script>

<style scoped lang="scss">
.rounded-avatar {
  border-radius: 50% !important;
}
.contact-card {
  border-radius: 10px;
}
</style>
