<template>
  <div
    class="fixed w-full min-h-screen bg-black/50 z-[1000] top-0 bottom-0 right-0 flex justify-end overflow-y-hidden"
    @click="close()"
  >
    <div
      class="w-full lg:w-8/12 h-full bg-white px-6 lg:px-12 py-6 lg:py-8 overflow-y-scroll"
      @click.stop
    >
      <q-form ref="formInput">
        <div class="row q-gutter-xl">
          <div class="col">
            <p class="label-style mb-1">
              Company name <span class="text-red-600">*</span>
            </p>
            <q-input
              v-model="form.company_name"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              dense
            />
          </div>
          <div class="col">
            <p class="label-style mb-1">
              Customer <span class="text-red-600">*</span>
            </p>
            <q-select
              v-model="form.customer"
              :options="customerOptionsFilter"
              use-input
              :rules="[(val) => required(val)]"
              @filter="filterCustomer"
              :input-debounce="700"
              outlined
              lazy-rules
              dense
              map-options
            />
          </div>
        </div>
        <div class="row q-gutter-xl">
          <div class="col">
            <p class="label-style mb-1">
              Agent <span class="text-red-600">*</span>
            </p>
            <q-select
              v-model="form.employee"
              :options="agentOptionsFilter"
              use-input
              :rules="[(val) => required(val)]"
              @filter="filterAgent"
              :input-debounce="700"
              outlined
              lazy-rules
              dense
              map-options
            />
          </div>
          <div class="col">
            <p class="label-style mb-1">
              Channel <span class="text-red-600">*</span>
            </p>
            <q-select
              v-model="form.channel"
              :options="channelOptions"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              dense
            />
          </div>
        </div>
        <div class="row q-gutter-xl">
          <div class="col-5">
            <p class="label-style mb-1">
              Session number <span class="text-red-600">*</span>
            </p>
            <q-input
              v-model="form.reference_number"
              :rules="[(val) => required(val)]"
              outlined
              lazy-rules
              dense
            />
          </div>
        </div>
        <!-- Button Action -->
        <div class="row q-mb-lg q-gutter-xl q-mt-lg">
          <div class="col flex">
            <div class="btn-dotted" @click="close()">
              <p>Return</p>
            </div>
          </div>
          <div class="col flex justify-end">
            <q-btn
              :loading="form.loading"
              color="primary"
              label="Save"
              class="dark-btn"
              @click="onSubmit()"
            />
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { required } from "src/utils/validation-rules.ts";
import { api } from "src/boot/axios";
import { addServiceReference } from "src/api/serviceRecord";
import { Loading, Notify } from "quasar";

const formInput = ref();
// would be separate to utility file
const channelOptions = ["whatsapp", "facebook", "line", "instagram"];
const customerOptions = ref(null);
const customerOptionsFilter = ref(customerOptions);
const agentOptions = ref(null);
const agentOptionsFilter = ref(agentOptions.value);
const form = reactive({
  customer: null,
  employee: null,
  customer_name: null,
  reference_number: null,
  channel: null,
  loading: false,
});
const emits = defineEmits(["close", "submit"]);
const onSubmit = async () => {
  const validate = await formInput.value.validate();
  if (!validate) return;
  Loading.show();
  await addServiceReference({
    ...form,
    customer_name: form.customer?.label,
    customer: form.customer?.value,
    employee: form.employee?.value,
  });
  close();
  Loading.hide();
  Notify.create({
    message: "Service reference successful added",
  });
  emits("submit");
};
const filterAgent = async (val, update) => {
  try {
    if (val === "") {
      agentOptions.value = await getAgent();
    } else {
      agentOptions.value = await getAgent(val);
    }
    update(async () => {
      const needle = val.toLowerCase();
      agentOptionsFilter.value = agentOptions.value
        .map((item) => ({
          label: `${item.first_name} ${item.last_name}`,
          value: item.id,
        }))
        .filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
    });
  } catch (error) {}
};
const filterCustomer = async (val, update) => {
  try {
    if (val === "") {
      customerOptions.value = await getCustomer();
    } else {
      customerOptions.value = await getCustomer(val);
    }
    update(async () => {
      const needle = val.toLowerCase();
      customerOptionsFilter.value = customerOptions.value
        .map((item) => ({
          label: `${item.first_name} ${item.last_name}`,
          value: item.id,
        }))
        .filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
    });
  } catch (error) {}
};

// separate to service record api
const getAgent = async (val) => {
  const { data } = await api.get("/users", {
    params: {
      fields: "*",
      limit: 10,
      search: val,
    },
  });
  return data.data;
};
// separate to service record api
const getCustomer = async (val) => {
  const { data } = await api.get("/items/customers", {
    params: {
      fields: "*",
      limit: 10,
      search: val,
    },
  });
  return data.data;
};
const close = () => {
  emits("close");
};
</script>
