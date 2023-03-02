<template>
  <div class="relative">
    <q-spinner-ios
      v-if="props.sendMessageStatus === SendMessageStatus.PENDING"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      color="white"
      size="2em"
    />
    <q-icon
      v-if="props.sendMessageStatus === SendMessageStatus.FAILURE"
      class="absolute -left-full"
      name="warning"
      color="warning"
      size="1rem"
    />
    <span v-if="props.content?.type === MessageType.IMAGE">
      <q-icon class="text-4xl" name="image" />
    </span>
    <span v-else-if="props.content?.type === MessageType.AUDIO">
      <q-icon class="text-4xl" name="mic" />
    </span>
    <span v-else>{{ props.content?.text ?? props.content }}</span>
  </div>
</template>

<script setup lang="ts">
import { MessageType, SendMessageStatus } from "src/types/MessagingTypes";
interface ContentType {
  type: string;
  text: string;
}
interface Props {
  content: ContentType;
  sendMessageStatus?: SendMessageStatus;
}

const props = withDefaults(defineProps<Props>(), {
  content: () => ({} as ContentType),
  sendMessageStatus: SendMessageStatus.DEFAULT,
});
</script>
