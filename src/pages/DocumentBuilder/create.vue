<template>
  <BaseForm @submit="submit" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import BaseForm from "../../components/DocumentBuilder/BaseForm.vue";
import { addDocumentTemplate } from "../../api/documentTemplate.js";
import { Notify } from "quasar";

const router = useRouter();
const loading = ref(true);

onMounted(() => {
  loading.value = false;
});

const submit = async (payload) => {
  const result = await addDocumentTemplate(payload);
  if (result.data?.errors) {
    Notify.create({
      message: "Error: " + result.data.errors[0].message,
      type: "negative",
    });
  }
  router.push("/document-builders");
};
</script>
