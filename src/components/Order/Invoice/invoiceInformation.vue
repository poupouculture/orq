<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getDocumentTemplates } from "src/api/documentTemplate";
import { Notify } from "quasar";

const components: any[] = ref([]);
const componentModels: string[] = ref([]);
const uplader: any = ref(null);

const imageSizeFilter = (files: readonly any[] | FileList) => {
  const filterFiles = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size <= 1024 * 1024 * 5) {
      filterFiles.push(file);
    }
  }
  if (!filterFiles.length) {
    Notify.create({
      message: "Image cannot exceed 5M",
      type: "negative",
      color: "purple",
      position: "top",
    });
  }

  return filterFiles;
};

const upload = (val) => {
  console.log(val);
};

onMounted(async () => {
  const result = await getDocumentTemplates({});
  const document = result.data.data.find((doc: any) => doc.type === "invoice");
  components.value = document.components;
  componentModels.value = Array(components.value.values.length).fill("");
});
</script>

<template>
  <div class="mt-5">
    <div
      class="w-full mt-4"
      v-for="(component, index) in components"
      :key="index"
    >
      <p class="label-style mb-2">{{ component.key.replace("_", " ") }}</p>
      <q-input
        v-model="componentModels[index]"
        :placeholder="component.key.replace('_', ' ')"
        dense
        outlined
        v-if="component.type === 'string'"
      />
      <q-input
        type="date"
        v-model="componentModels[index]"
        placeholder="Invoice Number"
        dense
        outlined
        v-if="component.type === 'date'"
      />
      <button
        class="px-4 py-2 bg-primary text-white rounded-md"
        @click="uplader?.pickFiles"
        v-if="component.type === 'media'"
      >
        <q-uploader
          ref="uplader"
          accept=".gif, .jpg, .jpeg, .png, image/*"
          class="hidden invisible"
          :filter="imageSizeFilter"
          @added="upload"
        />
        <q-icon name="image" />
        Upload
      </button>
      <div class="w-full flex flex-col" v-if="component.type === 'items'">
        <div class="w-full flex gap-3">
          <div class="w-5/12 flex flex-col">
            <div class="text-gray-500 font-semibold">ITEM</div>
            <input
              type="text"
              placeholder="Enter Item Name"
              class="w-full border rounded-lg mt-4 h-10 p-4"
            />
            <textarea
              rows="2"
              placeholder="Enter a description (optional)"
              class="w-full border rounded-lg mt-2 p-4"
            ></textarea>
          </div>
          <div class="w-3/12 flex flex-col">
            <div class="w-full text-right text-gray-500 font-semibold">QTY</div>
            <input
              type="number"
              placeholder="Enter the Qty"
              class="w-full border rounded-lg mt-4 h-10 p-4"
            />
            <button class="py-2 text-red-700 text-left">
              <q-icon name="add" class="text-xl" />
              Add Unit
            </button>
          </div>
          <div class="w-1/12 flex flex-col">
            <div class="w-full text-right text-gray-500 font-semibold">
              Rate
            </div>
            <input
              type="number"
              placeholder="Rate"
              class="w-full border rounded-lg mt-4 h-10 p-4"
            />
          </div>
          <div class="w-2/12 flex flex-col">
            <div class="w-full text-right text-gray-500 font-semibold">
              Total
            </div>
            <span class="text-right mt-4">HKD 0.00</span>
          </div>
        </div>
        <div class="w-full mt-4">
          <button class="border rounded-lg px-4 py-2">
            <q-icon name="add" class="text-xl" />
            Add Item
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.tax-selected div) {
  min-width: 100px;
}

:deep(.q-panel) {
  overflow-x: hidden !important;
}
</style>
