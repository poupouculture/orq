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
import useDocumentTemplateStore from "src/stores/modules/documentTemplate";
import { storeToRefs } from "pinia";

const documentTemplateStore = useDocumentTemplateStore();
const { documentTemplate } = storeToRefs(documentTemplateStore);
const router = useRouter();
const route = useRoute();
const loading = ref(true);
const id = ref("");

onMounted(async () => {
  id.value = route.params.id;
  const response = await documentTemplateStore.getDocumentTemplateById(
    id.value
  );
  documentTemplate.value = response.data.data;
  loading.value = false;
});

const submit = async (payload) => {
  await documentTemplateStore.updateDocumentTemplate(id.value, payload);
  await router.push("/document-builders/list/" + payload.type);
  location.reload();
};
</script>
