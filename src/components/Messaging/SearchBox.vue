<template>
  <q-input
    class="self-center mr-3"
    :class="{ 'mb-3': !isMobile, 'mb-1': isMobile }"
    dense
    clearable
    outlined
    label="Search"
    v-bind="$props"
    input-style="max-width: 125px"
  >
    <template v-slot:prepend>
      <q-icon name="search" />
    </template>
  </q-input>
</template>

<script setup>
import { computed } from "vue";
const isMobile = computed(() => window.innerWidth < 768);
</script>
