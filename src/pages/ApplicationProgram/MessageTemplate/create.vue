<template>
  <BaseLayout @submitGeneralInformation="submit" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import BaseLayout from "src/components/ApplicationProgram/BaseLayout.vue";
import { addMessageTemplate } from "src/api/messageTemplate.js";

const router = useRouter();
const loading = ref(true);

onMounted(() => {
  loading.value = false;
});

const submit = async (payload) => {
  await addMessageTemplate(payload);
  router.push("/application-programs/message-templates");
};
</script>

<style scoped src="./style.scss" />
