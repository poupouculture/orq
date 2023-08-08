<script setup>
defineProps({
  content: {
    type: Object,
  },
});
</script>

<template>
  <div class="w-full">
    <div
      :class="content.alignment === 'right' ? 'justify-end' : 'justify-start'"
      class="min-h-[500px] p-6 bg-center flex bg-cover"
      :style="{ backgroundImage: `url(${content.image})` }"
    >
      <div class="md:w-1/2 w-full">
        <article v-html="content.content" class="prose" />
      </div>
    </div>

    <div v-if="content.raw !== null" class="w-full">
      <iframe
        width="951"
        height="535"
        :src="`https://www.youtube.com/embed/${content.raw.videoId}${
          content.raw.autoplay ? '?autoplay=1&mute=1' : ''
        }`"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
