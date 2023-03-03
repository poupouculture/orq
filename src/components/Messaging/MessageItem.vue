<template>
  <div class="relative">
    <q-spinner-ios
      v-if="sendMessageStatus === SendMessageStatus.PENDING"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      color="white"
      size="2em"
    />
    <q-icon
      v-if="sendMessageStatus === SendMessageStatus.FAILURE"
      class="absolute -left-full"
      name="warning"
      color="warning"
      size="1rem"
    />
    <span v-if="content?.type === MessageType.IMAGE">
      <q-img
        :src="content.url"
        spinner-color="white"
        style="width: 200px; max-height: 300px"
      />
    </span>
    <span v-else-if="content?.type === MessageType.AUDIO">
      <q-icon class="text-4xl" name="mic" />
    </span>
    <span v-else>{{ content?.text ?? content }}</span>
  </div>
</template>

<script setup lang="ts">
import { MessageType, SendMessageStatus } from "src/types/MessagingTypes";
interface Props {
  content: any;
  sendMessageStatus?: SendMessageStatus;
}

withDefaults(defineProps<Props>(), {
  content: () => ({}),
  sendMessageStatus: SendMessageStatus.DEFAULT,
});
</script>
