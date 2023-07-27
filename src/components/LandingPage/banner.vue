<script setup>
const props = defineProps({
  content: {
    type: Object,
  },
});
</script>

<template>
  <div class="flex gap-4 flex-col mx-4">
    <q-img
      class="rounded-borders"
      :src="props.content.img"
      style="height: 180px; max-width: 150px"
    />

    <p class="text-justify" v-html="props.content.text"></p>
  </div>
</template>

<style scoped></style>
