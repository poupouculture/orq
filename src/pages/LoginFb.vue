<script setup>
import facebookLoginHandler from "src/helpers/facebook";
import { onMounted } from "vue";

onMounted(() => {
  facebookLoginHandler(window);
});
</script>

<template>
  <q-btn id="facebook" round class="bg-blue-700 text-white" icon="facebook" />
</template>

<style scoped></style>
