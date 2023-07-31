<script setup>
const props = defineProps({
  content: {
    type: Object,
  },
});
</script>

<template>
  <div
    class="flex gap-4 flex-col mx-4"
    v-for="(data, index) in props.content.content"
    :key="index"
  >
    <q-img
      class="rounded-borders"
      :src="data.icon"
      style="height: 180px; max-width: 150px"
    />
    <h1 class="font-bold" v-if="data.name !== null">
      {{ data.name }}
    </h1>
    <p
      class="text-justify"
      v-if="data.content !== null"
      v-html="data.content"
    ></p>
  </div>
</template>

<style scoped></style>
