<template>
  <BaseLayout @submitGeneralInformation="submit" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import BaseLayout from "../../components/ApplicationProgram/BaseLayout.vue";
import { addMessageTemplate } from "../../api/messageTemplate.js";

const router = useRouter();
const loading = ref(true);

onMounted(() => {
  loading.value = false;
});

const submit = async (payload) => {
  await addMessageTemplate(payload);
  router.push("/application-program");
};
</script>

<style scoped src="./style.scss" />
