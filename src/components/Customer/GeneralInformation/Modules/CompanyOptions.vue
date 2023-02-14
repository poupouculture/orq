<template>
  <div>
    <p class="mb-2">Company</p>
    <q-select
      v-model="companies"
      :options="companyOptionsFilter"
      use-input
      :rules="[(val) => required(val)]"
      @filter="filter"
      :input-debounce="700"
      outlined
      lazy-rules
      multiple
      dense
      map-options
      :disable="mode == 'show'"
      use-chips
    />
  </div>
</template>
<script setup lang="ts">
import { required } from "src/utils/validation-rules";
import { ref, computed, watch, onMounted } from "vue";
import type { Ref } from "vue";
import type { Company as ICompany } from "src/types/CompanyTypes";
import { api } from "src/boot/axios";

interface Option {
  value: string | number;
  label: string;
}
type ICompanyOptions = Option & ICompany;

const props = defineProps({
  mode: { default: "edit" },
  modelValue: { default: () => [] },
  customer: { type: Object, default: null },
});
const customer = computed(() => props.customer);
const emits = defineEmits(["update:modelValue"]);
watch(customer, (val: any) => {
  companies.value = [];
  setCompanyDefault(val);
});
const companies = computed({
  set: (val: ICompanyOptions[]) => emits("update:modelValue", val),
  get: () => props.modelValue,
});
const companyOptions: Ref<ICompanyOptions[]> = ref([]);
const companyOptionsFilter: Ref<Option[]> = ref(companyOptions);

const setCompanyDefault = (customer: any) => {
  if (customer.id && customer.companies.length) {
    companies.value = customer.companies.map((data: any) => ({
      label: data.companies_id.name_english,
      value: data.companies_id.id,
    }));
  }
};
onMounted(async () => {
  setCompanyDefault(customer.value);
});

const filter = async (val: string, update: any) => {
  try {
    if (val === "") {
      companyOptions.value = await searchCompany();
    } else {
      companyOptions.value = await searchCompany(val);
    }
    update(async () => {
      const needle = val.toLowerCase();
      companyOptionsFilter.value = companyOptions.value
        .map((item: ICompany) => ({
          label: `${item.name_english}`,
          value: item.id,
        }))
        .filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
    });
  } catch (error) {}
};

const searchCompany = async (val?: string) => {
  const { data } = await api.get("/items/companies", {
    params: {
      fields: "*",
      limit: 10,
      search: val,
    },
  });
  return data.data;
};
</script>
