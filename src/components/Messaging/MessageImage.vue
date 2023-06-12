<template>
  <div class="rounded-md mt-1">
    <img
      class="cursor-zoom-in max-h-36 rounded max-w-xs w-full object-cover object-center"
      ref="imageRef"
      @click.stop="visible = true"
    />
    <div
      class="mt-1 text-white break-all max-w-xs"
      :class="{ '!text-gray-800': !isSend }"
    >
      {{ caption }}
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

interface Props {
  src?: string;
  height?: number;
  name?: string;
  caption?: string;
  isSend: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  src: "",
  height: 128,
  name: "",
  caption: "",
  isSend: false,
});

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
