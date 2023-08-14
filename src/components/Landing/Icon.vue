<script setup>
defineProps({
  content: {
    type: Object,
  },
});

// Methods

const textAligment = (alignment) => {
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
              no-spinner
              class="rounded-borders"
              :src="children.icon"
              :style="children.raw"
            />
          </div>

          <div class="mx-2">
            <p
              class="mb-0 text-center text-[#403F3F] flex gap-3 items-center uppercase text-[24px]"
            >
              {{ children.name }}
            </p>
          </div>

          <span
            :class="textAligment(children.alignment)"
            class="font-normal w-[350px] capitalize text-[#5C5A8F] text-start leading-10 text-lg"
          >
            <article v-html="children.content" class="prose max-w-none px-4" />
          </span>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped lang="scss"></style>
