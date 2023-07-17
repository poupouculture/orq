<template>
  <div
    class="rounded-md mt-1"
    :class="{ 'flex items-center justify-between flex-row-reverse': isReply }"
  >
    <img
      class="cursor-zoom-in max-h-36 rounded max-w-full object-cover object-center"
      :class="{ 'w-12 h-12 rounded-md': isReply }"
      ref="imageRef"
      @click.stop="visible = true"
    />
    <div>
      <template v-if="isReply">
        <span v-if="!isSend" class="text-black text-semibold">
          {{
            replayMessage?.channel !== "chaq"
              ? replayMessage?.contact_name
              : replayMessage?.user_name
          }}
        </span>
        <span v-if="isSend" class="text-white text-semibold">
          {{ replayMessage?.user_name }}
        </span>
      </template>
      <div
        class="mt-1 text-white break-all max-w-xs flex items-center"
        :class="{ '!text-gray-800': !isSend }"
      >
        <svg
          v-if="isReply"
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current mr-2"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M15 8h.01"></path>
          <path
            d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z"
          ></path>
          <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5"></path>
          <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3"></path>
        </svg>
        <p>{{ isReply ? caption || "Image" : caption }}</p>
      </div>
    </div>
  </div>
  <q-dialog v-model="visible" no-shake>
    <q-card style="width: 1000px; max-width: 90vw">
      <q-card-section>
        <div>Image Mesage</div>
      </q-card-section>

      <q-card-section>
        <div class="w-full relative flex flex-col h-full">
          <img
            class="pointer-events-auto block max-h-full max-w-full m-auto"
            :src="originSrc || imageRef.src"
            :style="styleObj"
            alt="message_pic"
            @click="scaleImage"
          />

          <span class="mt-4 font-bold break-all">{{ caption }}</span>
        </div>

        <q-spinner
          v-if="!originSrc"
          class="absolute"
          color="primary"
          size="3em"
          :thickness="2"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, reactive } from "vue";
import { api } from "src/boot/axios";
import { blobToBase64 } from "src/utils/trim-word";
import useMessagingStore from "src/stores/modules/messaging";
import { storeToRefs } from "pinia";

interface Props {
  src?: string;
  height?: number;
  name?: string;
  caption?: string;
  isSend: boolean;
  isReply: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  src: "",
  height: 128,
  name: "",
  caption: "",
  isSend: false,
  isReply: false,
});

const messagingStore = useMessagingStore();
const { replayMessage } = storeToRefs(messagingStore);
const visible = ref(false);
const imageRef = ref();
const originSrc = ref();
const styleObj = reactive({
  transform: "",
  cursor: "zoom-in",
  transition: "transform 200ms ease 0s",
  transformOrigin: "",
});
const scale = ref(false);

watch(
  () => props.src,
  () => {
    renderImage();
  }
);

watch(
  () => visible.value,
  (value) => {
    if (value && !originSrc.value) {
      renderImage(value);
    }
  }
);

const renderImage = async (origin?: boolean) => {
  if (props.src.startsWith("data:")) {
    originSrc.value = imageRef.value.src = props.src;
  } else {
    const { data } = await api.get(`${process.env.BACKEND_URL}${props.src}`, {
      responseType: "blob",
      params: {
        fit: "inside",
        height: origin ? null : props.height,
      },
    });
    const base64 = await blobToBase64(data);
    if (origin) {
      originSrc.value = base64;
    } else {
      imageRef.value.src = base64;
    }
  }
};

const download = async () => {
  const link = document.createElement("a");
  if (!originSrc.value) {
    await renderImage(true);
  }
  link.href = originSrc.value;
  link.download = props.name;
  link.click();
};

const scaleImage = (e: any) => {
  scale.value = !scale.value;
  styleObj.transform = scale.value ? `scale(2, 2)` : "";
  styleObj.cursor = scale.value ? "zoom-out" : `zoom-in`;
  styleObj.transformOrigin = `${e.offsetX}px ${e.offsetY}px`;
};

onMounted(() => {
  renderImage();
});

defineExpose({
  download,
});
</script>

<style lang="scss" scoped></style>
