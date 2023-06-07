<template>
  <span class="cursor-pointer" @click="audioPlay">
    <audio
      ref="audio"
      @pause="playing = false"
      class="hidden invisible"
      :src="src"
    >
      <source :src="src" ref="source" />
    </audio>

    <q-icon v-show="playing" name="pause_circle" color="white" size="30px" />
    <q-icon
      v-show="!playing"
      name="play_circle_filled"
      color="white"
      size="30px"
    />
    <!-- <span>{{ duration }}</span> -->
  </span>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
// import { MessageType } from "src/types/MessagingTypes";
import { api } from "boot/axios";

interface Props {
  src?: string;
}

const props = withDefaults(defineProps<Props>(), {
  src: "",
});

const audio: any = ref(null);
const source: any = ref(null);
const playing = ref(false);

const getAudioData = async () => {
  console.log(props.src?.startsWith("blob"), props.src);
  if (props.src?.startsWith("blob")) {
    return;
  }
  const { data } = await api.get(props.src, {
    responseType: "blob",
  });
  const blob = new Blob([data], { type: "audio/wav" });
  source.value.src = (window.URL || window.webkitURL).createObjectURL(blob);
  audio.value.src = (window.URL || window.webkitURL).createObjectURL(blob);
};

watch(
  () => props.src,
  () => {
    if (!props.src?.startsWith("blob")) {
      getAudioData();
    }
  }
);
const audioPlay = async () => {
  console.log(audio.value);
  if (audio.value.paused) {
    await audio.value.play();
    playing.value = true;
  } else {
    await audio.value.pause();
    // audio.value.currentTime = 0;
    playing.value = false;
  }
};
// const duration = computed(() => {
//   if (props.content.duration) {
//     return Math.ceil(props.content.duration / 10) / 100 + "s";
//   }
//   return "";
// });
onMounted(() => {
  getAudioData();
});
</script>
