<template>
  <BaseForm :currentType="currentType" @submit="submit" v-if="!loading" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import BaseForm from "../../components/DocumentBuilder/BaseForm.vue";
import useDocumentTemplateStore from "src/stores/modules/documentTemplate";

const documentTemplateStore = useDocumentTemplateStore();
const router = useRouter();
const loading = ref(true);

const currentType = ref("");

onMounted(() => {
  currentType.value = router.currentRoute.value.params.type;
  loading.value = false;
});

const submit = async (payload) => {
  console.log("submit", payload);
  await documentTemplateStore.addDocumentTemplate(payload);
  await router.push("/document-builders/list/" + payload.type);
  location.reload();
};
</script>
