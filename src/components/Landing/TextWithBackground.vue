<script setup>
defineProps({
  content: {
    type: Object,
  },
});
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
        :src="`https://www.youtube.com/embed/${content.raw.videoId}?autoplay=1&mute=1&loop=1&playlist=${content.raw.videoId}`"
        title="Marvel&#39;s Spider-Man 2 - Story Trailer | PS5 Games"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>

      <div class="w-full">
        <div
          class="text-white flex justify-center items-center absolute top-0 bottom-0 w-full secondscreen"
        >
          <article v-html="content.content" class="prose" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.secondscreen {
  background: linear-gradient(
    10deg,
    rgb(58, 68, 79) 0%,
    rgba(113, 20, 20, 0) 100%
  );
}
</style>
