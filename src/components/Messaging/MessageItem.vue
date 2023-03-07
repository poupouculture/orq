<template>
  <div class="message-item relative">
    <q-spinner-ios
      v-if="sendMessageStatus === SendMessageStatus.PENDING"
      class="absolute left-0 -translate-x-9"
      color="primary"
      size="1em"
    />
    <q-icon
      v-if="sendMessageStatus === SendMessageStatus.FAILURE"
      class="absolute left-0 -translate-x-9"
      name="warning"
      color="warning"
      size="1rem"
    />
    <div v-if="content?.type === MessageType.IMAGE">
      <AuthImage
        class="image"
        :imgUrl="content.url + '&fit=inside&height=128'"
        :authToken="`Bearer ${getUserInfo.access_token}`"
      />
    </div>
    <span v-else-if="content?.type === MessageType.AUDIO">
      <q-icon
        class="cursor-pointer"
        name="record_voice_over"
        color="white"
        size="1rem"
        @click="audioPlay"
      />
      <audio ref="audio" class="hidden invisible" :src="content.url"></audio>
    </span>
    <span v-else-if="content?.type === MessageType.TEMPLATE">
      {{ messageTemplate(content) }}
    </span>
    <span v-else>{{ content?.text ?? content }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { api } from "boot/axios";
import useUserInfoStore from "stores/modules/userInfo";
import { MessageType, SendMessageStatus } from "src/types/MessagingTypes";
import AuthImage from "src/components/AuthImage/AuthImage.vue";

interface Props {
  content: any;
  sendMessageStatus?: SendMessageStatus;
}
const { getUserInfo } = useUserInfoStore();
const audio: any = ref(null);
const messageTemplate = (content: any) => {
  if (content?.template?.components) {
    const component = content?.template?.components?.find(
      (component: any) => component?.type === "body"
    );
    if (component) return component?.parameters[0].text;
  }

  return content?.template?.text;
};

const audioPlay = () => {
  if (audio.value.paused) {
    audio.value.play();
  } else {
    audio.value.pause();
    audio.value.currentTime = 0;
  }
};

const props = withDefaults(defineProps<Props>(), {
  content: () => ({}),
  sendMessageStatus: SendMessageStatus.DEFAULT,
});

watch(
  () => props.content.url,
  async (val) => {
    if (!val) return;
    const { data } = await api.get(val, {
      responseType: "blob",
    });
    const blob = new Blob([data], { type: "audio/mgpe" });
    audio.value.src = (window.URL || window.webkitURL).createObjectURL(blob);
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.message-item {
  .image {
    // width: 128px;
    height: 128px;
  }
}
</style>
