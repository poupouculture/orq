<script setup>
defineProps({
  content: {
    type: Object,
  },
});
</script>

<template>
  <div class="w-full flex justify-center">
    <article class="prose max-w-none">
      <h1 class="text-center">{{ content.name }}</h1>

      <div class="grid p-4 gap-10 w-full sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(children, index) in content.children"
          :key="index"
          class="flex rounded-lg drop-shadow-2xl bg-white w-full md:w-[320px] lg:w-[320px] xl:w-[380px] py-10 gap-10 items-center flex-col"
        >
          <div class="w-full flex justify-center">
            <q-img
              class="rounded-borders"
              :src="children.icon"
              style="max-width: 150px"
            />
          </div>

          <p
            class="mb-0 text-center text-[#403F3F] flex gap-3 items-center uppercase text-[32px]"
          >
            {{ children.name }}
          </p>

          <span
            class="font-normal w-[350px] capitalize text-[#5C5A8F] text-center leading-10 text-lg"
          >
            <article v-html="children.content" class="prose" />
          </span>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped lang="scss"></style>
