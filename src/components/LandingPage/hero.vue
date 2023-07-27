<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div
    :class="route.name == 'landingpage' ? 'min-h-screen' : 'lg:h-[70vh]'"
    class="homeHero flex flex-col items-center w-full p-5 lg:p-10"
  >
    <div class="container mt-6">
      <div
        :class="
          route.name == 'landingpage' && $q.screen.gt.md
            ? 'min-h-[90vh] '
            : 'h-[70vh]'
        "
        class="w-full flex flex-col mt-7 lg:px-20 justify-center items-start"
      >
        <div class="container mt-6">
          <slot />
        </div>
        <div class="flex w-full mt-24 justify-center">
          <button class="rounded-full p-2 border-dashed border-2">
            <q-icon class="text-white" name="arrow_downward" size="4rem" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
