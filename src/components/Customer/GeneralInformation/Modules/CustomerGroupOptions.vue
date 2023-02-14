<template>
  <div>
    <p class="mb-2">Customer Group</p>
    <q-select
      v-model="customerGroup"
      :options="customerGroupOptionsFilter"
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
import type { ICustomerGroup } from "src/types/CustomerGroupTypes";
import { api } from "src/boot/axios";

interface Option {
  value: string | number;
  label: string;
}
type ICustomerGroupOptions = Option & ICustomerGroup;

const props = defineProps({
  mode: { default: "edit" },
  modelValue: { default: () => [] },
  customer: { type: Object, default: null },
});
const customer = computed(() => props.customer);
const emits = defineEmits(["update:modelValue"]);
watch(customer, (val: any) => {
  customerGroup.value = [];
  setCustomerGroupDefault(val);
});
const customerGroup = computed({
  set: (val: ICustomerGroupOptions[]) => emits("update:modelValue", val),
  get: () => props.modelValue,
});
const customerGroupOptions: Ref<ICustomerGroupOptions[]> = ref([]);
const customerGroupOptionsFilter: Ref<Option[]> = ref(customerGroupOptions);

const setCustomerGroupDefault = (customer: any) => {
  if (customer.id && customer.customer_groups.length) {
    customerGroup.value = customer.customer_groups.map((data: any) => ({
      label: data.customer_groups_id.name,
      value: data.customer_groups_id.id,
    }));
  }
};
onMounted(async () => {
  setCustomerGroupDefault(customer.value);
});

const filter = async (val: string, update: any) => {
  try {
    if (val === "") {
      customerGroupOptions.value = await searchCustomerGroups();
    } else {
      customerGroupOptions.value = await searchCustomerGroups(val);
    }
    update(async () => {
      const needle = val.toLowerCase();
      customerGroupOptionsFilter.value = customerGroupOptions.value
        .map((item: ICustomerGroup) => ({
          label: `${item.name}`,
          value: item.id,
        }))
        .filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
    });
  } catch (error) {}
};

const searchCustomerGroups = async (val?: string) => {
  const { data } = await api.get("/items/customer_groups", {
    params: {
      fields: "*",
      limit: 10,
      search: val,
    },
  });
  return data.data;
};
</script>
