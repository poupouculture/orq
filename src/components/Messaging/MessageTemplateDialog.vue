<template>
  <q-dialog :modelValue="modelValue" @hide="hide">
    <q-card style="min-width: 85%; min-height: 85%" class="q-pa-lg">
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

      <q-card-section class="q-pt-none column items-center q-mt-lg">
        <BaseTable
          :rows="templates"
          :total-count="templates.length"
          :page="page"
          :columns="columns"
          v-model="selectedTemplates"
        >
          <template #body-cell-status="{ value }">
            <q-chip size="lg" color="success" square>{{ value }}</q-chip>
          </template>
        </BaseTable>
      </q-card-section>

      <q-card-actions align="right"> </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { IMessageTemplate } from "src/types/messageTemplateTypes";
import { getMessageTemplates } from "src/api/messageTemplate";
import { ref, onMounted, watch } from "vue";
import type { Ref } from "vue";
import BaseTable from "../BaseTable.vue";
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["hide"]);

const loading = ref(false);
const templates: Ref<IMessageTemplate[]> = ref([]);
const search: Ref<string> = ref("");
const page = ref(1);
const rowsPerPage = ref(10);
const selectedTemplates: Ref<IMessageTemplate[]> = ref([]);

const fetchTemplates = async () => {
  try {
    loading.value = true;
    const templateRequestResponse = await getMessageTemplates({
      limit: rowsPerPage.value,
      page: page.value,
    });
    templates.value = templateRequestResponse.data.data as IMessageTemplate[];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const columns = [
  {
    name: "name",
    label: "Template Name",
  },
  {
    name: "status",
    label: "Status",
  },
  {
    name: "language",
    label: "Language",
  },
  {
    name: "messages_sent",
    label: "Delivered",
  },
  {
    name: "messages_read",
    label: "Read",
  },
];

watch([rowsPerPage, page], () => {
  fetchTemplates();
});

onMounted(() => {
  fetchTemplates();
});

const hide = () => {
  emit("hide");
};
</script>
