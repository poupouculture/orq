<template>
  <div class="main-container">
    <p class="header-text">Document Template</p>
    <div class="mt-10 grid gird-rows-1 grid-cols-3 gap-3">
      <div
        class="flex flex-col p-4 bg-white text-center shadow-md rounded-lg"
        v-for="(documentType, index) in activedDocuments"
        :key="index"
      >
        <div class="text-xl text-primary font-semibold">
          {{ documentType.title }} Document
        </div>
        <div class="mx-auto my-6">
          <img :src="documentType.icon" class="w-24" />
        </div>
        <div class="w-full flex flex-col gap-2">
          <button
            class="w-full py-2 rounded-lg bg-gray-500 text-white"
            @click="
              router.push(`/document-builders/${documentType.active}/preview`)
            "
          >
            <q-icon name="fa fa-eye" class="mr-2"></q-icon>
            See Active Document
          </button>
          <button
            class="w-full py-2 rounded-lg bg-primary text-white"
            @click="router.push(`/document-builders/list/${documentType.name}`)"
          >
            <q-icon name="fa fa-list" class="mr-2"></q-icon>
            See All Documents
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import useDocumentTemplateStore from "src/stores/modules/documentTemplate";
import { storeToRefs } from "pinia";

const documentTemplateStore = useDocumentTemplateStore();
const { activedDocuments } = storeToRefs(documentTemplateStore);
const router = useRouter();

onMounted(async () => {
  await documentTemplateStore.getActivedDocuments();
});
</script>
<style scoped src="./style.scss" />
