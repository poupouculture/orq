<template>
  <BaseForm
    @submit="submit"
    :documentTemplate="documentTemplate"
    v-if="!loading"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import BaseForm from "../../components/DocumentBuilder/BaseForm.vue";
import {
  getDocumentTemplate,
  updateDocumentTemplate,
} from "../../api/documentTemplate.js";

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const id = ref("");
const documentTemplate = ref(null);

onMounted(async () => {
  id.value = route.params.id;
  documentTemplate.value = await getDocumentTemplate(id.value);
  console.log(documentTemplate.value);
  loading.value = false;
});

const submit = async (payload) => {
  await updateDocumentTemplate(id.value, payload);
  router.push("/document-builders");
};
</script>
