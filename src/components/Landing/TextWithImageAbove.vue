<script setup lang="ts">
import { IContent, Alignment } from "src/types/LandingPageTypes";
defineProps<{
  content?: any | IContent;
}>();
</script>

<template>
  <div class="flex gap-4 flex-col mx-7 my-5 w-full">
    <q-img
      :class="content.alignment === Alignment.TOP ? 'order-2' : 'order-1'"
      class="rounded-borders"
      :src="content.image"
      style="height: 580px"
    />

    <article
      :class="content.alignment === Alignment.TOP ? 'order-1' : 'order-2'"
      v-html="content.content"
      class="prose max-w-none"
    />
  </div>
</template>

<style scoped lang="scss"></style>
