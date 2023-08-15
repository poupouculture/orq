<script setup>
import { ref } from "vue";

defineProps({
  content: {
    type: Object,
  },
});

const unmute = ref(false);

// Methods

const textAligment = (alignment) => {
  if (alignment === "center") {
    return "justify-center items-center";
  } else if (alignment === "left") {
    return "justify-start items-start";
  } else if (alignment === "right") {
    return "justify-end items-end";
  }
};

const contentTextAlignment = (alignment) => {
  if (alignment === "center") {
    return "text-center";
  } else if (alignment === "left") {
    return "text-start";
  } else if (alignment === "right") {
    return "text-end";
  }
};
</script>

<template>
  <div class="w-full mx-5">
    <div
      v-if="content.content"
      :class="textAligment(content.alignment)"
      class="min-h-[500px] p-6 bg-center flex bg-cover"
      :style="{ backgroundImage: `url(${content.image})` }"
    >
      <div class="md:w-1/2 w-full">
        <article
          v-html="content.content"
          :class="contentTextAlignment(content.alignment)"
          class="prose max-w-none"
        />
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
          <div
            :class="textAligment(content.alignment)"
            class="w-full relative flex flex-col mx-5 gap-4"
          >
            <h1
              :style="{ color: content.raw.color }"
              class="mb-0 text-3xl lg:text-6xl text-capitalize font-bold"
            >
              {{ content.raw.content }}
            </h1>

            <span :style="{ color: content.raw.color }" class="text-xl">
              {{ content.raw.subtitleContent }}
            </span>

            <q-btn
              tag="a"
              target="_blank"
              :href="`https://www.youtube.com/embed/${content.raw.videoId}`"
              unelevated
              rounded
              color="primary"
              label="See Video"
            />

            <div class="absolute right-10 -bottom-64">
              <q-icon
                @click="unmute = !unmute"
                class="cursor-pointer"
                size="sm"
                :name="unmute ? 'volume_up' : 'volume_off'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
