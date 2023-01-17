<template>
  <BaseLayout :applicationProgram="applicationProgram" @submitGeneralInformation="submit"/>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import BaseLayout from "../../components/ApplicationProgram/BaseLayout.vue";
import {
  getApplicationProgram,
  updateApplicationProgram
} from "../../api/aplicationPrograms.js";

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const applicationProgram = ref(null);

onMounted(async() => {
  const id = route.params.id;
  applicationProgram.value = await getApplicationProgram(id);
  loading.value = false;
});

const submit = async (payload) => {
  await updateApplicationProgram(route.params.id, payload);
  router.push("/application-program");
};
</script>

<style scoped src="./style.scss" />
