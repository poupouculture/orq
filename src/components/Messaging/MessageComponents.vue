<template>
  <div class="message-item relative">
    <div class="image" v-if="content?.type === MessageType.IMAGE">
      <img class="h-full" v-if="content.local" :src="content.url" />
      <AuthImage
        v-else
        :imgUrl="content.url + '&fit=inside&height=128'"
        :authToken="`Bearer ${getUserInfo.access_token}`"
      />
    </div>
    <span
      v-else-if="content?.type === MessageType.AUDIO"
      class="cursor-pointer"
      @click="audioPlay"
    >
      <audio ref="audio" class="hidden invisible" :src="content.url"></audio>
      <q-icon name="play_circle_filled" color="white" size="30px" />
      <span>{{ duration }}</span>
    </span>
    <span v-else-if="content?.type === MessageType.TEMPLATE">
      {{ messageTemplate(content) }}
    </span>
    <span v-else>{{ content?.text ?? content }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
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
    if (props.content.local) return;
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

const duration = computed(() => {
  if (props.content.duration) {
    return Math.ceil(props.content.duration / 10) / 100 + "s";
  }
  return "";
});
</script>

<style lang="scss" scoped>
.message-item {
  .image {
    // width: 128px;
    height: 128px;
  }
}
</style>
