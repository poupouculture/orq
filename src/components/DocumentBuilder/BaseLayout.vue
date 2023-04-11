<template>
  <div class="main-container">
    <p class="header-text text-2xl">
      <router-link
        to="/document-components"
        style="text-decoration: none; color: inherit"
      >
        <span class="text-gray-400 cursor-pointer">
          <q-icon name="fa-solid fa-arrow-left" />
          Document Builder /
        </span>
      </router-link>
      Document Components
    </p>
    <div class="w-full flex bg-[#fdfdfd] rounded-lg">
      <div class="w-2/3 flex flex-col p-6">
        <div class="label flex flex-col">
          <p class="text-xl">Name</p>
          <p class="text-gray-400">Type your component name</p>
        </div>

        <input
          type="text"
          class="w-full h-9 block border rounded-lg my-2 pl-4"
          v-model="name"
        />

        <div class="label flex flex-col">
          <p class="text-xl">Type</p>
          <p class="text-gray-400">Type of the component</p>
        </div>

        <div class="w-full md:w-4/12 lg:w-3/12 mt-2 mb-4">
          <InputSelect
            :options="typeLabels"
            :default="type"
            :value="type"
            @input="updateType"
            v-if="!loading"
          />
        </div>

        <div class="label flex flex-col">
          <p class="text-xl">Text</p>
          <p class="text-gray-400">Type your component text</p>
        </div>

        <input
          type="text"
          class="w-full h-9 block border rounded-lg my-2 pl-4"
          v-model="text"
        />

        <div class="label flex flex-col">
          <p class="text-xl">Width</p>
          <p class="text-gray-400">Type your component width in pixels</p>
        </div>

        <div class="w-full md:w-4/12 lg:w-3/12 mt-2 mb-4">
          <input
            type="number"
            class="w-full h-9 block border rounded-lg mt-2 px-4"
            v-model="width"
            min="0"
          />
        </div>

        <div class="label flex flex-col">
          <p class="text-xl">Height</p>
          <p class="text-gray-400">Type your component height in pixels</p>
        </div>

        <div class="w-full md:w-4/12 lg:w-3/12 mt-2 mb-4">
          <input
            type="number"
            class="w-full h-9 block border rounded-lg mt-2 px-4"
            v-model="height"
            min="0"
          />
        </div>

        <div class="row gap-4 mt-4">
          <router-link
            to="/document-components/"
            style="text-decoration: none; color: inherit"
          >
            <p
              class="py-2 px-6 rounded text-primary border-2 border-dashed border-primary"
            >
              Return
            </p>
          </router-link>
          <button
            class="py-2 px-6 rounded bg-primary text-white"
            @click="submitGeneralInformation"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import InputSelect from "../../components/InputSelect.vue";

const emit = defineEmits(["submitGeneralInformation"]);
const props = defineProps({
  documentComponent: {
    type: Object,
    default: () => null,
  },
});

const typeValues = [
  "label",
  "input-text",
  "input-number",
  "input-date",
  "textarea",
];
const typeLabels = [
  "Label",
  "Input Text",
  "Input Number",
  "Input Date",
  "Textarea",
];

const name = ref("");
const type = ref("Label");
const text = ref("");
const height = ref(0);
const width = ref(0);
const loading = ref(true);

const updateType = (value) => {
  type.value = typeValues[typeLabels.indexOf(value)];
};

const submitGeneralInformation = () => {
  emit("submitGeneralInformation", {
    name: name.value,
    type: type.value,
    text: text.value,
    height: height.value,
    width: width.value,
  });
};

onMounted(() => {
  if (props.documentComponent) {
    const tempData = props.documentComponent;
    name.value = tempData.name;
    type.value = typeLabels[typeValues.indexOf(tempData.type)];
    text.value = tempData.text;
    height.value = tempData.height;
    width.value = tempData.width;
  }
  loading.value = false;
});
</script>
