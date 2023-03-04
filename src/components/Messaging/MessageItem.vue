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
      <!-- {{ content.url }} -->
      <AuthImage
        :imgUrl="content.url + '&fit=inside&width=128&height=128'"
        :authToken="`Bearer ${getUserInfo.access_token}`"
      />
    </span>
    <span v-else-if="content?.type === MessageType.AUDIO">
      <q-icon class="text-4xl" name="mic" />
    </span>
    <span v-else-if="content?.type === MessageType.TEMPLATE">
      {{ messageTemplate(content) }}
    </span>
    <span v-else>{{ content?.text ?? content }}</span>
  </div>
</template>

<script setup lang="ts">
import useUserInfoStore from "stores/modules/userInfo";
import { MessageType, SendMessageStatus } from "src/types/MessagingTypes";
import AuthImage from "src/components/AuthImage/AuthImage.vue";

interface Props {
  content: any;
  sendMessageStatus?: SendMessageStatus;
}
const { getUserInfo } = useUserInfoStore();

const messageTemplate = (content: any) => {
  if (content?.template?.components) {
    const component = content?.template?.components?.find(
      (component) => component?.type === "body"
    );
    if (component) return component?.parameters[0].text;
  }

  return content?.template?.text;
};

withDefaults(defineProps<Props>(), {
  content: () => ({}),
  sendMessageStatus: SendMessageStatus.DEFAULT,
});
</script>
