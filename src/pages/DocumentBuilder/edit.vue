<template>
  <BaseForm
    :documentTemplate="documentTemplate"
    @submitGeneralInformation="submit"
    v-if="!loading"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import BaseForm from "src/components/DocumentBuilder/BaseForm.vue";
import {
  getDocumentTemplate,
  updateDocumentTemplate,
} from "src/api/DocumentTemplates";

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const documentTemplate = ref(null);

onMounted(async () => {
  const id = route.params.id;
  documentTemplate.value = await getDocumentTemplate(id);
  loading.value = false;
});

const submit = async (payload) => {
  await updateDocumentTemplate(route.params.id, payload);
  router.push("/document-builders");
};
</script>

<style scoped src="./style.scss" />
