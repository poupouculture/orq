<template>
  <BaseTable
    :rows="propsTable.applicationPrograms"
    :total-count="propsTable.totalCount"
    :page="propsTable.page"
    :rows-per-page="propsTable.rowsPerPage"
    :columns="headerColumns"
    :loading="false"
    :disable-select="propsTable.isSimple"
    v-model:selected="selected"
    @changePage="changePage"
  >
    <q-tr :props="props">
      <q-th v-for="col in props.cols" :key="col.name" :props="props" auto-width>
        {{ col.label }}
      </q-th>
    </q-tr>
    <template #body-cell-name="props">
      <q-td
        :props="props"
        :class="{ 'cursor-pointer': propsTable.isSimple }"
        @dblclick="useTemplate(props.row)"
      >
        {{ props.row.name }}
      </q-td>
    </template>
    <template #body-cell-status="props">
      <q-td
        :props="props"
        :class="{ 'cursor-pointer': propsTable.isSimple }"
        @dblclick="useTemplate(props.row)"
      >
        <span
          class="text-xs font-semibold py-1 px-2 rounded text-[#70CC6B] bg-green-200"
        >
          {{ props.row.status }}
        </span>
      </q-td>
    </template>
    <template #body-cell-is_approved="props">
      <q-td
        :props="props"
        :class="{ 'cursor-pointer': propsTable.isSimple }"
        @dblclick="useTemplate(props.row)"
      >
        {{ props.row.is_approved ? "Yes" : "No" }}
      </q-td>
    </template>
    <template #body-cell-is_email_template="props">
      <q-td
        :props="props"
        :class="{ 'cursor-pointer': propsTable.isSimple }"
        @dblclick="useTemplate(props.row)"
      >
        {{ props.row.is_email_template ? "Yes" : "No" }}
      </q-td>
    </template>
    <template #body-cell-language="props">
      <q-td
        :props="props"
        :class="{ 'cursor-pointer': propsTable.isSimple }"
        @dblclick="useTemplate(props.row)"
      >
        {{ props.row.language }}
      </q-td>
    </template>
    <template #body-cell-delivered="props">
      <q-td
        :props="props"
        :class="{ 'cursor-pointer': propsTable.isSimple }"
        @dblclick="useTemplate(props.row)"
      >
        {{ props.row.delivered ? props.row.delivered : 0 }}
      </q-td>
    </template>
    <template #body-cell-read="props">
      <q-td
        :props="props"
        :class="{ 'cursor-pointer': propsTable.isSimple }"
        @dblclick="useTemplate(props.row)"
      >
        {{ props.row.messages_opened ? props.row.messages_opened : 0 }}
      </q-td>
    </template>
    <template #body-cell-replied="props">
      <q-td
        :props="props"
        :class="{ 'cursor-pointer': propsTable.isSimple }"
        @dblclick="useTemplate(props.row)"
      >
        {{ props.row.top_block_reason ? props.row.top_block_reason : 0 }}
      </q-td>
    </template>
    <template #body-cell-user_created="props">
      <q-td
        :props="props"
        :class="{ 'cursor-pointer': propsTable.isSimple }"
        @dblclick="useTemplate(props.row)"
      >
        {{ props.row.user_created }}
      </q-td>
    </template>
    <template #body-cell-date_created="props">
      <q-td
        :props="props"
        :class="{ 'cursor-pointer': propsTable.isSimple }"
        @dblclick="useTemplate(props.row)"
      >
        {{ dateFormatter(props.row.date_created) }}
      </q-td>
    </template>
    <template #body-cell-action="props">
      <q-td :props="props">
        <router-link
          :to="`/application-programs/${
            propsTable.formType === 'bots'
              ? 'chatbots'
              : propsTable.formType === 'customer-service'
              ? 'customer-services'
              : 'message-templates'
          }/${props.row.id}`"
          style="text-decoration: none; color: inherit"
          v-if="!propsTable.isSimple"
        >
          <p class="edit-button">Edit</p>
        </router-link>
        <button @click="previewTemplate(props.row)" v-else>Preview</button>
      </q-td>
    </template>
  </BaseTable>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { dateFormatter } from "src/helpers";
import BaseTable from "src/components/BaseTable.vue";

const propsTable = defineProps({
  applicationPrograms: {
    type: Array,
    default: () => [],
  },
  totalCount: {
    type: Number,
    default: () => 0,
  },
  page: {
    type: Number,
    default: () => 0,
  },
  rowsPerPage: {
    type: Number,
    default: () => 0,
  },
  isSimple: {
    type: Boolean,
    default: () => false,
  },
  formType: {
    type: String,
    required: false,
    default: () => "message",
  },
});

const emit = defineEmits(["changePage", "useTemplate", "previewTemplate"]);

const headerColumns = ref([
  {
    name: "name",
    align: "left",
    label: "Template Name",
    field: "name",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "category",
    align: "left",
    label: "Category",
    field: "category",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "status",
    align: "center",
    label: "Status",
    field: "status",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "is_approved",
    align: "center",
    label: "Approved",
    field: "is_approved",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "is_email_template",
    align: "center",
    label: "Is Email",
    field: "is_email_template",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "language",
    align: "center",
    label: "Language",
    field: "language",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "messages_sent",
    align: "center",
    label: "Delivered",
    field: "messages_sent",
    classes: "text-black",
  },
  {
    name: "messages_opened",
    align: "center",
    label: "Read",
    field: "messages_opened",
    classes: "text-black",
  },
  {
    name: "top_block_reason",
    align: "center",
    label: "Replied",
    field: "top_block_reason",
    classes: "text-black",
  },
  // {
  //   name: "user_created",
  //   align: "center",
  //   label: "Created By",
  //   field: "user_created",
  //   classes: "text-black",
  // },
  {
    name: "date_created",
    align: "center",
    label: "Created On",
    field: "date_created",
    classes: "text-black",
    sortable: true,
  },
  {
    name: "action",
    align: "center",
    label: "",
    field: "action",
    classes: "text-blue",
  },
]);

const selected = ref([]);

const changePage = (val) => {
  emit("changePage", val);
};

const useTemplate = (val) => {
  emit("useTemplate", val);
};

const previewTemplate = (val) => {
  emit("previewTemplate", val);
};

onMounted(() => {
  if (propsTable.isSimple) {
    headerColumns.value = headerColumns.value.filter(
      (h) =>
        h.name !== "is_approved" &&
        h.name !== "date_created" &&
        h.name !== "user_created" &&
        h.name !== "top_block_reason" &&
        h.name !== "messages_sent" &&
        h.name !== "messages_opened"
    );
  }
  if (propsTable.formType !== "bots") {
    headerColumns.value = headerColumns.value.filter(
      (h) => h.name !== "category"
    );
  }
});
</script>
