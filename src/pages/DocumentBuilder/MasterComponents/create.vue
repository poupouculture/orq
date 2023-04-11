<template>
  <BaseLayout @submitGeneralInformation="submit" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import BaseLayout from "src/components/DocumentBuilder/BaseLayout.vue";
import { addDocumentComponent } from "src/api/documentComponents.js";
import { Loading, Notify } from "quasar";

const router = useRouter();
const loading = ref(true);

onMounted(() => {
  loading.value = false;
});

const submit = async (payload) => {
  Loading.show();
  await addDocumentComponent(payload);
  Notify.create({
    message: "Document Component has been saved",
    color: "primary",
    type: "positive",
    position: "top",
  });
  Loading.hide();
  router.push("/document-components");
};
</script>

<style scoped src="../style.scss" />
