<template>
  <img
    class="h-full cursor-zoom-in h-32"
    ref="imageRef"
    @click.stop="visible = true"
  />
  <q-dialog v-model="visible" no-shake>
    <span class="relative flex h-full w-full">
      <img
        class="pointer-events-auto block max-h-full max-w-full m-auto"
        :src="originSrc || imageRef.src"
        alt="message_pic"
      />
      <q-btn
        class="absolute pointer-events-auto"
        :style="{ top: '5px', right: '5px' }"
        dense
        flat
        color="white"
        text-color="black"
        icon="close"
        v-close-popup
      >
      </q-btn>
    </span>
    <q-spinner
      v-if="!originSrc"
      class="absolute"
      color="primary"
      size="3em"
      :thickness="2"
    />
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { api } from "src/boot/axios";
import { blobToBase64 } from "src/utils/trim-word";

interface Props {
  src?: string;
  height?: number;
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  src: "",
  height: 128,
  name: "",
});

const visible = ref(false);
const imageRef = ref();
const originSrc = ref();

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

onMounted(() => {
  renderImage();
});
</script>

<style lang="scss" scoped></style>
