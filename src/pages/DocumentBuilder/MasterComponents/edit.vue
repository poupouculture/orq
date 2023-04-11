<template>
  <BaseLayout
    @submitGeneralInformation="submit"
    :documentComponent="documentComponent"
    v-if="!loading"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import BaseLayout from "src/components/DocumentBuilder/BaseLayout.vue";
import {
  getDocumentComponent,
  updateDocumentComponent,
} from "src/api/documentComponents.js";
import { Notify } from "quasar";

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const id = ref("");
const documentComponent = ref(null);

onMounted(async () => {
  id.value = route.params.id;
  const response = await getDocumentComponent(id.value);
  documentComponent.value = response.data.data;
  loading.value = false;
});

const submit = async (payload) => {
  const result = await updateDocumentComponent(id.value, payload);
  if (result.data?.errors) {
    Notify.create({
      message: "Error: " + result.data.errors[0].message,
      type: "negative",
    });
  }
  router.push("/document-components");
};
</script>
