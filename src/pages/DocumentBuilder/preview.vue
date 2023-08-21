<template>
  <Preview
    @submit="submit"
    :documentTemplate="documentTemplate"
    v-if="!loading"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import Preview from "../../components/DocumentBuilder/Preview.vue";
import {
  getDocumentTemplate,
  updateDocumentTemplate,
} from "../../api/documentTemplate.js";
import { Notify } from "quasar";

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const id = ref("");
const documentTemplate = ref(null);

onMounted(async () => {
  id.value = route.params.id;
  const response = await getDocumentTemplate(id.value);
  documentTemplate.value = response.data.data;
  loading.value = false;
});

const submit = async (payload) => {
  const result = await updateDocumentTemplate(id.value, payload);
  if (result.data?.errors) {
    Notify.create({
      message: "Error: " + result.data.errors[0].message,
      type: "negative",
    });
  }
  router.push("/document-builders");
};
</script>
