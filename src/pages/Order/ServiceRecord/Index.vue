<template>
  <div class="service-record q-px-lg py-5">
    <h2 class="text-h5 font-semibold mt-3">Service Record</h2>
    <MessageBox
      title="About service records"
      :message="message"
      :show="show"
      @click="close()"
    />
    <!-- Search and Add button-->
    <div class="flex items-center justify-between my-5">
      <div class="w-52">
        <q-input
          placeholder="Search Items..."
          bg-color="transparent"
          outlined
          dense
          class="border-gray-400"
        >
          <template v-slot:prepend>
            <q-icon name="search" class="text-gray-400" />
          </template>
          <template v-slot:append>
            <q-icon name="filter_list" class="text-gray-400" />
          </template>
        </q-input>
      </div>
      <q-btn
        class="bg-primary text-white"
        @click="showAddServiceReference = true"
      >
        <q-icon name="add" class="text-white mr-2" />
        <span>Add</span>
      </q-btn>
    </div>

    <BaseTable
      :rows="rows"
      :total-count="meta.total_count"
      :page="pagination.page"
      :rows-per-page="pagination.rowsPerPage"
      :columns="columns"
      :loading="loading"
      @changePage="changePage"
      :disableSelect="true"
    >
      <template v-slot:index="props">
        <q-td :props="props">
          {{ props }}
        </q-td>
      </template>
      <template v-slot:body-cell-customer="props">
        <q-td :props="props">
          <q-icon name="fa-solid fa-headphones" />
          <span class="ml-2">{{ props.value }}</span>
          <p class="text-xs text-gray-400 mt-1 font-normal">
            <span class="description -ml-1">测试1</span>
          </p>
        </q-td>
      </template>

      <template v-slot:body-cell-employee="props">
        <q-td class="align-text-top" :props="props">
          <q-icon name="fa-regular fa-user" />
          <span class="ml-2" v-if="props.value"
            >{{ props.value.first_name }} {{ props.value.last_name }}</span
          >
        </q-td>
      </template>

      <template v-slot:body-cell-channel="props">
        <q-td
          ><img
            :src="getChannelImages(props.value)"
            class="w-7 h-7"
            :alt="props.value"
        /></q-td>
      </template>

      <template v-slot:body-cell-reference_number="props">
        <q-td>
          <span>{{ props.value || "-" }}</span>
        </q-td>
      </template>

      <template v-slot:body-cell-date_created="props">
        <q-td>
          <span>{{ format(new Date(props.value), "Y-MM-d HH:mm:ss") }}</span>
        </q-td>
      </template>

      <template v-slot:body-cell-detail="props">
        <q-td
          ><RouterLink
            :to="{
              name: 'order.service-record.detail',
              params: { id: props.value },
            }"
            class="details text-blue-800 px-2 md:px-0"
            >Details</RouterLink
          ></q-td
        >
      </template>

      <template v-slot:bottom-row>
        <div class="placeholder h-24"></div>
      </template>

      <template v-slot:bottom>
        <Pagination
          :total="97"
          :current="pagination.page"
          :size="pagination.rowsPerPage"
        />
      </template>
    </BaseTable>
    <AddServiceReference
      v-if="showAddServiceReference"
      @close="showAddServiceReference = false"
      @submit="onSubmit"
    />
  </div>
</template>
<script setup>
import MessageBox from "src/components/MessageBox.vue";
import Pagination from "src/components/Pagination.vue";
import useServiceRecordStore from "src/stores/modules/serviceRecord";
import whatsapp from "src/assets/images/whatsapp.png";
import instagram from "src/assets/images/instagram.png";
import line from "src/assets/images/line.png";
import facebook from "src/assets/images/facebook.png";
import { format } from "date-fns";
import BaseTable from "src/components/BaseTable.vue";

import { ref, onMounted, computed } from "vue";
import AddServiceReference from "src/components/ServiceReference/AddServiceReference.vue";
const message = `Every time you talk with a customer, a "service record" will be automatically generated, and each record contains at least - more conversation records to form a complete service information for you to query Close it.`;

const serviceRecordStore = useServiceRecordStore();
const meta = computed(() => serviceRecordStore.meta);
const show = ref(true),
  showAddServiceReference = ref(false),
  columns = [
    {
      name: "index",
      label: "#",
      field: "index",
    },
    {
      name: "customer",
      label: "Customer",
      field: "customer_name",
      align: "left",
      headerStyle: "width: 300px",
      headerClasses: "header",
    },
    {
      name: "employee",
      label: "Agent",
      field: "employee",
      align: "left",
      headerStyle: "width: 300px",
      headerClasses: "header",
    },
    {
      name: "channel",
      label: "Channel",
      field: "channel",
      align: "left",
      headerStyle: "width: 300px",
      headerClasses: "header",
    },
    {
      name: "reference_number",
      label: "Session number",
      field: "reference_number",
      align: "left",
      headerStyle: "width: 300px",
      headerClasses: "header",
    },
    {
      name: "date_created",
      label: "Start time",
      field: "date_created",
      align: "left",
      headerStyle: "width: 260px",
      headerClasses: "header",
    },
    {
      name: "detail",
      label: "",
      field: "id",
      align: "left",
      headerStyle: "width: 100px;",
      headerClasses: "header",
    },
  ],
  rows = computed(() => serviceRecordStore.getItems),
  loading = ref(false),
  pagination = ref({
    page: 1,
    rowsPerPage: 6,
    totalCount: 0,
  });

// would be seperate to helper or utilities
const getChannelImages = (type) => {
  switch (type) {
    case "facebook":
      return facebook;
    case "line":
      return line;
    case "instagram":
      return instagram;
    default:
      return whatsapp;
  }
};
onMounted(async () => {
  loading.value = true;
  await serviceRecordStore.getAll();
  loading.value = false;
});
const onSubmit = async () => {
  loading.value = true;
  await serviceRecordStore.getAll();
  loading.value = false;
};
const changePage = async () => {
  await serviceRecordStore.getAll({
    limit: pagination.value.rowsPerPage,
    page: pagination.value.page,
  });
};
function close(state) {
  show.value = state;
}
</script>

<style lang="scss" scoped>
:deep {
  .header {
    color: #9a9aaf;
  }
  .q-icon {
    justify-content: flex-end;
    margin-top: -2px;
  }
  .q-td {
    padding: 8px 0;
  }
  .q-table th:nth-child(n + 2),
  td:nth-child(n + 2) {
    padding-left: 0;
  }
}

.description {
  display: inline-block;
  transform: scale(0.8);
}

.details:hover {
  text-decoration: underline;
}
</style>
