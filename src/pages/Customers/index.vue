<template>
  <div class="main-container">
    <p class="header-text">Customers</p>
    <div class="row justify-between">
      <q-input placeholder="Search" outlined dense>
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <div>
        <q-btn
          icon="add"
          no-caps
          rounded
          color="primary"
          label="Add"
          class="q-mr-sm"
          @click="router.push('/customers/create')"
        />
        <q-btn icon="delete" no-caps rounded label="Trash" />
      </div>
    </div>
    <div class="main-content">
      <q-table
        :selected-rows-label="getSelectedString"
        selection="multiple"
        class="statement-table"
        :rows="data.customers"
        :hide-header="grid"
        :columns="headerColumns"
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
        flat
      >
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            auto-width
          >
            {{ col.label }}
          </q-th>
        </q-tr>

        <template #body-cell-name="props">
          <q-td :props="props" auto-width>
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { getCustomers } from "../../api/customers.js";
import { useRouter } from "vue-router";

const router = useRouter();

const headerColumns = [
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

const selected = ref([]);
const data = reactive({
  customers: [],
});

const groupedCompanies = (companies) => {
  const grouped = companies.map((company) => company.companies_id.name_english);
  return grouped.join(", ");
};

onMounted(async () => {
  const {
    data: { data: customers },
  } = await getCustomers();

  data.customers = customers;
});
</script>

<style scoped src="./style.scss" />
