<template>
  <div class="main-container">
    <q-table
      :selected-rows-label="getSelectedString"
      selection="multiple"
      class="statement-table"
      :rows="data.customers"
      :hide-header="grid"
      :columns="currencyColumns"
      row-key="__index"
      :grid="grid"
      :filter="filter"
      v-model:pagination="pagination"
      :rows-per-page-options="[6]"
      @focusin="activateNavigation"
      @focusout="deactivateNavigation"
      @keydown="onKey"
      tabindex="0"
      :loading="loading"
      table-class="my-custom"
      v-model:selected="selected"
    >
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>

      <template #body-cell-name="props">
        <q-td :props="props">
          <div class="firstrowholder">
            <div>
              <q-avatar
                size="36px"
                color="red"
                text-color="white"
                icon="directions"
              />
            </div>
            <div class="subrow">
              <p class="headingtext">
                {{ props.row.first_name }} {{ props.row.last_name }}
              </p>
              <p class="subheadingtext">2022-8-10</p>
            </div>
          </div>
          <p></p>
        </q-td>
      </template>
      <template #body-cell-customerCode="props">
        <q-td :props="props">
          {{ props.row.customer_code }}
        </q-td>
      </template>
      <template #body-cell-company="props">
        <q-td :props="props">
          {{ groupedCompanies(props.row.companies) }}
        </q-td>
      </template>
      <template #body-cell-action="props">
        <q-td :props="props">
          <router-link
            :to="`/customers/${props.row.id}`"
            style="text-decoration: none; color: inherit"
          >
            <p class="edit-button">Edit</p></router-link
          >
        </q-td>
      </template>
      <template>
        <div class="absolute-bottom-right">
          <q-pagination
            v-model="current"
            max="5"
            direction-links
            push
            color="teal"
            active-design="push"
            active-color="orange"
          />
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { getCustomers } from "../../api/customers.js";
import "../ContactsTable/ContactsTable.scss";

// const statuses = ["Active", "Inactive"];
const currencyColumns = [
  {
    name: "name",
    align: "left",
    label: "Name",
    field: "name",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "company",
    align: "left",
    label: "Company",
    field: "company",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "customerCode",
    align: "left",
    label: "Customer Code",
    field: "customerCode",
    sortable: true,
    classes: "text-black",
  },
  {
    name: "label",
    align: "center",
    label: "Label",
    field: "label",
    classes: "text-black",
  },

  {
    name: "action",
    align: "center",
    label: "Action",
    field: "action",
    classes: "text-blue",
  },
];
// const currencies = [
//   {
//     IncurredMonth: {
//       data: "ss",
//     },
//     InvoiceDate: "2022-10-10",
//     InvoiceNo: "F00110",
//
//     CsCode: "CODE12",
//     CoCodeOther: "ABC130",
//     NoofChit: "120",
//     Invoice: "Edit",
//
//     status: "Active",
//   },
//
//   {
//     IncurredMonth: "2022 SEP",
//     InvoiceDate: "2022-10-10",
//     InvoiceNo: "F00110",
//
//     CsCode: "CODE12",
//     CoCodeOther: "ABC130",
//     NoofChit: "120",
//     Invoice: "Edit",
//
//     status: "Active",
//   },
// ];
const selected = ref([]);
const data = reactive({
  customers: [],
});

// const fd = reactive({
//   shape: ref("Enable"),
//   grid: false,
//   selected: [],
//   statusOpts: statuses,
//   inFs: false,
//   model: ref(null),
//   options: ["Active", "Inactive"],
//   noti: () => {},
//   show_dialog: false,
//   editedIndex: -1,
//   editedItem: defaultItem,
//   filter: "",
//   currencyColumns,
//   currencyData: currencies,
//   pagination: {
//     page: 1,
//   },
//   page: 1,
//   totalRecord: 0,
//   pageCount: 1,
// });

// function addRow() {
//   if (fd.editedIndex > -1) {
//     Object.assign(fd.currencyData[fd.editedIndex], fd.editedItem);
//   } else {
//     fd.currencyData.push(fd.editedItem);
//   }
//   fd.close();
// }
//
// function deleteItem(item) {
//   const index = fd.currencyData.indexOf(item);
//   confirm("Are you sure you want to delete this item?") &&
//     fd.currencyData.splice(index, 1);
// }
//
// function editItem(item) {
//   fd.editedIndex = fd.currencyData.findIndex(
//     (v, i) => v.__index === item.__index
//   );
//   fd.editedItem = Object.assign({}, item);
//   fd.show_dialog = true;
// }
//
// function editModal(item) {}
//
// function close() {
//   fd.show_dialog = false;
//   setTimeout(() => {
//     fd.editedItem = defaultItem;
//     fd.editedIndex = -1;
//   }, 300);
// }
//
// function setFs(props) {
//   props.toggleFullscreen();
//   fd.inFs = props.inFullscreen;
// }

const groupedCompanies = (companies) => {
  const grouped = companies.map((company) => company.companies_id.name_english);
  return grouped.join(", ");
};

onMounted(async () => {
  const {
    data: { data: customers },
  } = await getCustomers();

  data.customers = customers;
  // fd.currencyData = fd.currencyData.map((v, i) => ({ ...v, __index: i }));
});
</script>
