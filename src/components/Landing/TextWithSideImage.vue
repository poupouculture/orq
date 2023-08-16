<script setup>
defineProps({
  content: {
    type: Object,
  },
});
</script>

<template>
  <div class="grid md:grid-cols-2 gap-4 mx-7 my-5 w-full">
    <div
      :class="content.alignment === 'left' ? 'order-1 lg:order-2' : 'order-1'"
      class="col-span-1"
    >
      <q-img
        no-spinner
        class="rounded-borders"
        :src="content.image"
        style="height: 380px"
      />
    </div>

    <div
      :class="content.alignment === 'left' ? 'order-1' : 'order-2'"
      class="col-span-1 flex flex-col"
    >
      <article v-html="content.content" class="prose max-w-none" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
