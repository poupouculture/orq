<template>
  <div class="grid grid-cols-3 gap-14 mb-4">
    <div
      class="p-4"
      @click="setMedia('image')"
      :class="{
        'bg-[#eff2fe]': media === 'image',
        'bg-white': media !== 'image',
      }"
    >
      <input
        type="radio"
        class="appearance-none h-4 w-4 rounded-full bg-white border checked:ring-4 checked:h-2 checked:w-2 checked:ring-primary"
        @click="setMedia('image')"
        :checked="media === 'image'"
      />
      <div class="w-full flex flex-col items-center my-4">
        <img
          src="../../assets/images/image-active.svg"
          alt=""
          v-if="media === 'image'"
        />
        <img src="../../assets/images/image.svg" alt="" v-else />
        <span
          class="text-lg font-bold mt-2"
          :class="{
            'text-primary': media === 'image',
            'text-gray-400': media !== 'image',
          }"
        >
          Image
        </span>
      </div>
    </div>
    <div
      class="p-4"
      @click="setMedia('video')"
      :class="{
        'bg-[#eff2fe]': media === 'video',
        'bg-white': media !== 'video',
      }"
    >
      <input
        type="radio"
        class="appearance-none h-4 w-4 rounded-full bg-white border checked:ring-4 checked:h-2 checked:w-2 checked:ring-primary"
        @click="setMedia('video')"
        :checked="media === 'video'"
      />
      <div class="w-full flex flex-col items-center my-4">
        <img
          src="../../assets/images/video-active.svg"
          alt=""
          v-if="media === 'video'"
        />
        <img src="../../assets/images/video.svg" alt="" v-else />
        <span
          class="text-lg font-bold mt-2"
          :class="{
            'text-primary': media === 'video',
            'text-gray-400': media !== 'video',
          }"
        >
          Video
        </span>
      </div>
    </div>
    <div
      class="p-4"
      @click="setMedia('document')"
      :class="{
        'bg-[#eff2fe]': media === 'document',
        'bg-white': media !== 'document',
      }"
    >
      <input
        type="radio"
        class="appearance-none h-4 w-4 rounded-full bg-white border checked:ring-4 checked:h-2 checked:w-2 checked:ring-primary"
        @click="setMedia('document')"
        :checked="media === 'document'"
      />
      <div class="w-full flex flex-col items-center my-4">
        <img
          src="../../assets/images/document-active.svg"
          alt=""
          v-if="media === 'document'"
        />
        <img src="../../assets/images/document.svg" alt="" v-else />
        <span
          class="text-lg font-bold mt-2"
          :class="{
            'text-primary': media === 'document',
            'text-gray-400': media !== 'document',
          }"
        >
          Document
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits(["updateMedia"]);

const media = ref(null);

const setMedia = (value) => {
  media.value = value;
  emit("updateMedia", value);
};
</script>
