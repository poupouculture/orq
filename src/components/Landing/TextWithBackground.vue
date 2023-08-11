<script setup>
import { ref } from "vue";

defineProps({
  content: {
    type: Object,
  },
});

const unmute = ref(false);
</script>

<template>
  <div class="w-full mx-5">
    <div
      :class="content.alignment === 'right' ? 'justify-end' : 'justify-start'"
      class="min-h-[500px] p-6 bg-center flex bg-cover"
      :style="{ backgroundImage: `url(${content.image})` }"
    >
      <div class="md:w-1/2 w-full">
        <article v-html="content.content" class="prose" />
      </div>
    </div>

    <div v-if="content.raw !== null" class="w-full relative">
      <iframe
        width="100%"
        height="735"
        :src="`https://www.youtube.com/embed/${
          content.raw.videoId
        }?autoplay=1&mute=${unmute ? '0' : '1'}&loop=1&playlist=${
          content.raw.videoId
        }`"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>

      <div class="w-full">
        <div
          :style="{
            background: `linear-gradient(${content.raw.overlayColor})`,
          }"
          class="text-white flex justify-center items-center absolute top-0 bottom-0 w-full"
        >
          <!-- <article v-html="content.content" class="prose" /> -->

          <div
            class="w-full relative flex flex-col items-center gap-4 justify-center"
          >
            <h1 class="mb-0 text-3xl lg:text-6xl text-capitalize font-bold">
              {{ content.raw.content }}
            </h1>

            <span class="text-xl">
              {{ content.raw.subtitleContent }}
            </span>

            <div class="absolute right-10 -bottom-72">
              <!-- <q-btn fab icon="add" color="accent" /> -->

              <q-toggle
                v-model="unmute"
                unchecked-icon="volume_off"
                checked-icon="volume_up"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
