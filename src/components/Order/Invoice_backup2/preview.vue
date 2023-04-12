<script setup lang="ts">
import { getDocumentTemplates } from "src/api/documentTemplate";
import { onMounted, ref } from "vue";
import { components as comp } from "src/constants/documentTemplate.js";

const components: any[] = ref([]);

const isComponentExist = (componentName) => {
  return components.value.find((c) => c.key === componentName);
};

const getPropFromComponent = (componentName, property) => {
  console.log(
    components.value?.find((cp) => cp.key === componentName)[property]
  );

  return components.value?.find((cp) => cp.key === componentName)[property];
};

onMounted(async () => {
  const result = await getDocumentTemplates({});
  const document = result.data.data.find((doc: any) => doc.type === "invoice");
  components.value = document.components;

  console.log(components.value?.find((cp) => cp.key === comp.TITLE));
});
</script>

<template>
  <div
    class="px-5 pt-5 pb-10 mt-5 rounded-lg bg-white w-full"
    style="height: 1000px"
  >
    <!-- <Vue3DraggableResizable
      :initW="components.value?.find((cp) => cp.key === 'TITLE')?.w"
      :initH="components.value?.find((cp) => cp.key === 'TITLE')?.h"
      :x="components.value?.find((cp) => cp.key === 'TITLE')?.x"
      :y="components.value?.find((cp) => cp.key === 'TITLE')?.y"
      :draggable="false"
      :resizable="false"
      class="text-center"
      v-if="isComponentExist('TITLE')"
    >
      
    </Vue3DraggableResizable> -->

    <h1
      class="text-2xl"
      :style="
        'width: ' +
        getPropFromComponent('TITLE', 'w') +
        'px;' +
        'height: ' +
        getPropFromComponent('TITLE', 'h') +
        'px;' +
        'margin-left: ' +
        getPropFromComponent('TITLE', 'x') +
        'px;' +
        'margin-top: ' +
        getPropFromComponent('TITLE', 'y') +
        'px;'
      "
      v-if="isComponentExist('TITLE')"
    >
      Invoice
    </h1>
  </div>
</template>

<style scoped></style>
