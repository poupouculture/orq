<template>
  <BaseTable
    :rows="propsTable.campaigns"
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
    <template #body-cell-sent="props">
      <q-td
        :props="props"
        :class="{ 'cursor-pointer': propsTable.isSimple }"
        @dblclick="useTemplate(props.row)"
      >
        <span>
          {{ props.row.sent || "-" }}
        </span>
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
        {{ props.row.read ? props.row.read : 0 }}
      </q-td>
    </template>
    <template #body-cell-replied="props">
      <q-td
        :props="props"
        :class="{ 'cursor-pointer': propsTable.isSimple }"
        @dblclick="useTemplate(props.row)"
      >
        {{ props.row.replied ? props.row.replied : 0 }}
      </q-td>
    </template>
    <template #body-cell-user_created="props">
      <q-td
        :props="props"
        :class="{ 'cursor-pointer': propsTable.isSimple }"
        @dblclick="useTemplate(props.row)"
      >
        {{ props.row.user_created.first_name }}
        {{ props.row.user_created.last_name }}
      </q-td>
    </template>
    <template #body-cell-date_created="props">
      <q-td
        :props="props"
        :class="{ 'cursor-pointer': propsTable.isSimple }"
        @dblclick="useTemplate(props.row)"
      >
        {{ format(new Date(props.row.date_created), "Y-MM-d HH:mm:ss") }}
      </q-td>
    </template>
    <template #body-cell-action="props">
      <q-td :props="props">
        <router-link
          :to="`/application-programs/${
            propsTable.formType === 'bots'
              ? 'chatbots'
              : props.formType === 'customer-service'
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
import BaseTable from "src/components/BaseTable.vue";
import { format } from "date-fns";

const propsTable = defineProps({
  campaigns: {
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
    label: "Campaigns Name",
    field: "name",
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
    name: "sent",
    align: "center",
    label: "Sent",
    field: "sent",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "delivered",
    align: "center",
    label: "Delivered",
    field: "delivered",
    classes: "text-black",
  },
  {
    name: "read",
    align: "center",
    label: "Read",
    field: "read",
    classes: "text-black",
  },
  {
    name: "replied",
    align: "center",
    label: "Replied",
    field: "replied",
    classes: "text-black",
  },
  {
    name: "user_created",
    align: "center",
    label: "Created By",
    field: "user_created",
    classes: "text-black",
  },
  {
    name: "date_created",
    align: "center",
    label: "Created On",
    field: "date_created",
    classes: "text-black",
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
        h.name !== "replied" &&
        h.name !== "delivered" &&
        h.name !== "read"
    );
  }
  if (propsTable.formType !== "bots") {
    headerColumns.value = headerColumns.value.filter(
      (h) => h.name !== "category"
    );
  }
});
</script>
