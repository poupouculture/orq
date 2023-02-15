<template>
  <q-dialog :modelValue="modelValue" @hide="hide">
    <q-card
      style="min-width: 85%; min-height: 85%"
      class="q-pa-lg flex flex-col justify-between"
    >
      <div class="w-full" v-if="usedTemplate === null">
        <q-card-section>
          <div class="text-h6">Choose Template</div>
          <div class="text-h7">All Templates</div>

          <div class="q-mt-lg" style="max-width: 250px">
            <q-input
              placeholder="Search by template name"
              outlined
              dense
              type="search"
              max-width="250px"
              :model-value="search"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </q-card-section>

        <div class="w-11/12 mx-auto mt-10">
          <TableComponent
            :applicationPrograms="data.applicationPrograms"
            :totalCount="data.totalCount"
            :page="data.page"
            :rowsPerPage="data.rowsPerPage"
            :isSimple="true"
            v-model:selected="selectedTemplate"
            @useTemplate="useTemplate"
          />
        </div>

        <q-card-actions align="right"> </q-card-actions>
      </div>
      <div class="w-full flex" v-else>
        <div class="w-7/12 flex flex-col border-r pr-2">
          <p class="font-semibold">Add Sample Content</p>
          <p class="mt-4">
            To help us understand what kind of message you want to send, you
            have the option to provide specific content examples for your
            template. You can add a sample template for one or all languages you
            are submitting.
          </p>
          <p class="mt-4">
            Make sure not to include any actual user or customer information,
            and provide only sample content in your examples.
            <a href="#" class="text-primary"> Learn More </a>
          </p>
          <div
            class="w-4/12 flex flex-col"
            v-if="header.toUpperCase() === 'MEDIA'"
          >
            <p class="mt-4 font-semibold">Header</p>
            <button class="mt-2 py-2 bg-primary text-white rounded-md">
              Choose JPG or PNG file
            </button>
          </div>
          <p class="mt-4 font-semibold">Body</p>
          <p class="text-gray-500 mt-2">
            {{ bodyMessage }}
          </p>

          <input
            type="text"
            class="w-full h-8 px-4 py-1 mt-2 rounded-md border-2 border-primary"
            v-for="(cusVar, index) of customVariables"
            v-model="customVariables[index]"
            :key="index"
            :placeholder="'Enter content for {{' + (index + 1) + '}}'"
          />
        </div>
        <div class="w-1/3 p-6 flex flex-col">
          <span class="text-xl">Preview</span>
          <Preview
            :header="header"
            :headerMessage="headerMessage"
            :media="media"
            :bodyMessage="bodyMessage"
            :footerMessage="footerMessage"
            :actionCategory="actionCategory"
            :actions="actions"
            :replies="replies"
            v-if="!loading"
          />
        </div>
      </div>

      <div class="w-full flex justify-end gap-2 px-4">
        <button class="btn-dotted" @click="hide">Return</button>
        <button
          class="px-4 py-2 bg-primary text-white rounded-md"
          @click="send"
        >
          Send
        </button>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { getMessageTemplates } from "src/api/messageTemplate";
import { ref, onMounted, watch, reactive } from "vue";
import type { Ref } from "vue";
import TableComponent from "src/components/ApplicationProgram/TableComponent.vue";
import Preview from "src/components/ApplicationProgram/Preview.vue";
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["hide", "send"]);

const loading = ref(false);
const search: Ref<string> = ref("");
const page = ref(1);
const rowsPerPage = ref(10);
const selectedTemplate = ref([]);
const usedTemplate = ref(null);
const language = ref("");
const templateName = ref("");
const header = ref("");
const headerMessage = ref("");
const media = ref("");
const bodyMessage = ref("");
const footerMessage = ref("");
const actionCategory = ref("None");
const replies = ref(["", ""]);
const actions = ref(Array(2).fill(null));
const customVariables = ref([]);

const data = reactive({
  applicationPrograms: [],
  totalCount: 0,
  page: 1,
  rowsPerPage: 10,
});

const fetchTemplates = async () => {
  loading.value = true;
  const {
    data: { data: applicationPrograms, meta },
  } = await getMessageTemplates({
    limit: data.rowsPerPage,
    page: data.page,
    status: "published",
  });
  data.applicationPrograms = applicationPrograms;
  data.totalCount = meta?.total_count;
  loading.value = false;
};

watch([rowsPerPage, page], () => {
  fetchTemplates();
});

onMounted(() => {
  fetchTemplates();
});

const hide = () => {
  usedTemplate.value = null;
  emit("hide");
};

const send = () => {
  const numbers = listNumbers(bodyMessage.value);

  numbers.forEach((num, index) => {
    bodyMessage.value = bodyMessage.value.replace(
      num,
      customVariables.value[index]
    );
  });

  emit("send", templateName.value, bodyMessage.value, language.value);
  emit("hide");
};

const listNumbers = (str: string) => {
  const regex = /{{\s*([\d]+)\s*}}/g;
  let match;
  const numbers: string[] = [];
  while ((match = regex.exec(str)) !== null) {
    numbers.push("{{" + Number(match[1]) + "}}");
  }
  return numbers;
};

const useTemplate = (val: any) => {
  templateName.value = val.name;
  language.value = val.language;

  usedTemplate.value = val;
  if (val.components) {
    const headerComponent = val.components.find(
      (c: any) => c?.type === "HEADER"
    );
    header.value = headerComponent.value?.format;
    if (header.value.toUpperCase() === "TEXT") {
      headerMessage.value = headerComponent.value?.text;
    } else {
      media.value = headerComponent.value?.text;
    }
  }

  if (val.json?.components) {
    const bodyComponent = val.json.components.find(
      (c: any) => c?.type === "BODY"
    );
    bodyMessage.value = bodyComponent.text;
    const customerVariableCounted = listNumbers(bodyMessage.value).length;
    if (customerVariableCounted > 0) {
      customVariables.value = Array(customerVariableCounted).fill("");
    }
  }
};
</script>
