<template>
  <span class="cursor-pointer" @click="audioPlay">
    <audio
      ref="audio"
      @pause="playing = false"
      class="hidden invisible"
      :src="src"
    ></audio>

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
import { ref, onMounted } from "vue";
// import { MessageType } from "src/types/MessagingTypes";
import { api } from "boot/axios";

interface Props {
  src?: string;
}

const props = withDefaults(defineProps<Props>(), {
  src: "",
});

const audio: any = ref(null);
const playing = ref(false);

const getAudioData = async () => {
  if (props.src?.startsWith("blob")) {
    return;
  }
  const { data } = await api.get(props.src, {
    responseType: "blob",
  });
  const blob = new Blob([data], { type: "audio/wav" });
  audio.value.src = (window.URL || window.webkitURL).createObjectURL(blob);
};

const audioPlay = () => {
  if (audio.value.paused) {
    audio.value.play();
    playing.value = true;
  } else {
    audio.value.pause();
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
