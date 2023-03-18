<template>
  <img
    class="h-full cursor-zoom-in h-32"
    ref="imageRef"
    v-touch-hold:600.mouse.prevent="handleHold"
    @click.stop="visible = true"
  />
  <q-menu
    ref="menu"
    v-model="showing"
    fit
    transition-show="scale"
    transition-hide="scale"
  >
    <q-list>
      <q-item clickable v-close-popup @click="download">
        <q-item-section>Down load</q-item-section>
      </q-item>
    </q-list>
  </q-menu>

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
const showing = ref(false);
const menu = ref();
const imageRef = ref();
const originSrc = ref();

// watch(
//   () => props.src,
//   () => {
//     renderImage();
//   }
// );

watch(
  () => visible.value,
  (value) => {
    if (value && !originSrc.value) {
      renderImage(value);
    }
  }
);

const renderImage = async (origin?: boolean) => {
  if (props.src.startsWith("blob")) {
    originSrc.value = imageRef.value.src = props.src;
  } else {
    const { data } = await api.get(`${process.env.BACKEND_URL}${props.src}`, {
      responseType: "blob",
      params: {
        fit: "inside",
        height: origin ? null : props.height,
      },
    });
    if (origin) {
      originSrc.value = (window.URL || window.webkitURL).createObjectURL(data);
    } else {
      imageRef.value.src = (window.URL || window.webkitURL).createObjectURL(
        data
      );
    }
  }
};

const handleHold = () => {
  showing.value = true;
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

onMounted(() => {
  renderImage();
});
// onBeforeUnmount(() => {
//   window.URL.revokeObjectURL(imageRef.value);
//   window.URL.revokeObjectURL(originSrc.value);
// });
</script>

<style lang="scss" scoped></style>
