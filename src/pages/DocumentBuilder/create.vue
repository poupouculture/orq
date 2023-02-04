<template>
  <BaseForm @submit="submit" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import BaseForm from "../../components/DocumentBuilder/BaseForm.vue";
import { addDocumentTemplate } from "../../api/documentTemplate.js";

const router = useRouter();
const loading = ref(true);

onMounted(() => {
  loading.value = false;
});

const submit = async (payload) => {
  await addDocumentTemplate(payload);
  router.push("/document-builders");
};
</script>
