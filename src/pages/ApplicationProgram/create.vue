<template>
  <BaseLayout @submitGeneralInformation="submit" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import BaseLayout from "../../components/ApplicationProgram/BaseLayout.vue";
import { addApplicationProgram } from "../../api/aplicationPrograms.js";

const router = useRouter();
const loading = ref(true);

onMounted(() => {
  loading.value = false;
});

const submit = async (payload) => {
  await addApplicationProgram(payload);
  router.push("/application-program");
};
</script>

<style scoped src="./style.scss" />
