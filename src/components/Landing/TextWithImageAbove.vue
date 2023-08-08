<script setup>
defineProps({
  content: {
    type: Object,
  },
});
</script>

<template>
  <div class="flex gap-4 flex-col mx-7 my-5 w-full">
    <q-img class="rounded-borders" :src="content.image" style="height: 580px" />

    <article v-html="content.content" class="prose" />
  </div>
</template>

<style scoped lang="scss"></style>
